import {
  HighlightService,
  Highlight,
  MarketChange,
} from './../../services/highlight.service';
import AlertInterface from '../../services/AlertInterface';
import { LocalStorageService } from './../../services/local-storage.service';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css'],
})
export class HighlightComponent implements OnInit, OnDestroy {
  @Input() ticker: string;
  @Input() highlights = new Highlight();

  public alerts: AlertInterface[] = [];
  private highlightService: HighlightService;
  private storage: LocalStorageService;
  public quantity: number = 0;
  portfolio;
  public money: string;
  public canSell: boolean = false;

  bookmarked: boolean;

  interval;

  constructor(
    service: HighlightService,
    storage: LocalStorageService,
    private modalService: NgbModal
  ) {
    this.highlightService = service;
    this.storage = storage;
  }

  updateDate() {
    this.portfolio = this.storage.getPurchases().filter((stock) => stock[0] == this.ticker)[0];
    if (Array.isArray(this.portfolio) && this.portfolio.length > 0) {
      if (this.portfolio[1].qty > 0) {
        this.canSell = true;
      } else {
        this.canSell = false;
      }
    } else {
      this.canSell = false;
    }
  }

  ngOnInit(): void {
    this.updateDate();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['highlights'] && this.highlights) {
      this.bookmarked = this.storage.isBookmarked(this.ticker);
      if (this.highlights.marketStatus == 1) {
        this.interval = setInterval(() => {
          this.getHighlights();
        }, 15000);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getHighlights() {
    this.highlightService
      .getData(this.ticker)
      .subscribe((results: Highlight) => {
        this.highlights = { ...results };
      });
  }

  toggleBookmark() {
    let ticker = this.highlights.ticker;
    this.bookmarked = !this.bookmarked;
    if (this.storage.isBookmarked(ticker)) {
      this.storage.unsetBookmark(ticker);
      this.addAlert({
        type: 'danger',
        message: ticker + ' removed from Watchlist',
      });
    } else {
      this.storage.setBookmark(ticker, this.highlights.name);
      this.addAlert({
        type: 'success',
        message: this.highlights.ticker + ' added to Watchlist',
      });
    }
  }

  //Modal
  openModal(content) {
    this.money = this.storage.getMoney();
    this.modalService.open(content, {
      ariaLabelledBy: 'Buy Stock',
    });
  }

  closeModal(type) {
    this.modalService.dismissAll();
    if (type == 'buy') {
      this.storage.buy(
        this.highlights.ticker,
        this.highlights.name,
        this.quantity,
        this.highlights.last
      );
      this.addAlert({
        type: 'success',
        message: this.highlights.ticker + ' bought successfully!',
      });
    } else if (type == 'sell') {
      this.storage.sell(
        this.highlights.ticker,
        this.quantity,
      );
      this.addAlert({
        type: 'success',
        message: this.highlights.ticker + ' sell successfully!',
      });
    }
    this.quantity = 0;
    this.updateDate();
  }

  //Alerts
  addAlert(alert: AlertInterface) {
    this.alerts.unshift(alert);
    setTimeout(() => {
      this.alerts.pop();
    }, 5000);
  }

  closeAlert(alert: AlertInterface) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}
