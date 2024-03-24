import { InsightsService, Insights } from '../../services/insights.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css'],
})
export class InsightsComponent implements OnInit {
  @Input() ticker: string;
  
  private InsightsService: InsightsService;
  public insight;
  closeResult = '';

  constructor(service: InsightsService, private modalService: NgbModal) {
    this.InsightsService = service;
  }

  ngOnInit(): void {
    this.getInsights(this.ticker);
  }

  getInsights(ticker) {
    this.InsightsService.getData(ticker).subscribe((results: Insights) => {
      this.insight = results;
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  showDte(timestamp){
    console.log(timestamp);
    var date = new Date(timestamp*1000); // 时间戳为毫秒级别
 
    var year = date.getFullYear();
    var month = (date.getMonth() + 1);
    var day = date.getDate().toString().padStart(2, '0');
    var month_str="";
    if(month==1){
      month_str="January";
    }else if(month==2){
        month_str="February";
    }else if(month==3){
        month_str="March";
    }else if(month==4){
        month_str="April";
    }else if(month==5){
        month_str="May";
    }else if(month==6){
        month_str="June";
    }else if(month==7){
        month_str="July";
    }else if(month==8){
        month_str="August";
    }else if(month==9){
        month_str="September";
    }else if(month==10){
        month_str="October";
    }else if(month==11){
        month_str="November";
    }else if(month==12){
        month_str="December";
    }
 
    return `${month_str},${day},${year}`;
  }

  encode(url: string) {
    return encodeURIComponent(url);
  }
}
