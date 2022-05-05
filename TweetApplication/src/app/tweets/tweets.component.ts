import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllTweets } from '../model/tweets-model';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css'],
})
export class TweetsComponent implements OnInit {
  submitted = false;
  allTweets: any = [];
  displayNoData: string;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllTweets();
    // this.addForm = this.fb.group({
    //     comments: ['', Validators.required],
    // });
  }

  getAllTweets() {
    this.http
      .get('http://localhost:8080/api/v1.0/tweets/all')
      .subscribe((data) => {
        this.allTweets = data;
        console.log(this.allTweets);
        if (this.allTweets.length > 0) {
          this.displayNoData = 'true';
        } else {
          this.displayNoData = 'false';
        }
      });
  }
}
