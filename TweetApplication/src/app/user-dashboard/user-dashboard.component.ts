import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login-service.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  @ViewChild('addform')
  addform: ElementRef;
  userName: string;
  lastTweet: any;
  tweetCreate: FormGroup;
  user: any;
  comment: string;
  searchUser: string;
  name: string;
  tweetText: string;
  showcomments: boolean = false;
  tweetId: string;
  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getLatestTweet();

    this.getWelcomeUserName();
    this.tweetCreate = this.fb.group({
      tweetText: ['', [Validators.required]],
    });
  }

  getWelcomeUserName() {
    const fullName =
      localStorage.getItem('firstName') == null
        ? ''
        : localStorage.getItem('firstName');
    if (fullName != null) {
      this.userName = fullName;
    }
  }

  getLastUpdatedTweet() {
    this.getLatestTweet();
  }

  getLatestTweet() {
    this.loginService.getAllTweets().subscribe((data) => {
      this.lastTweet = data;
      console.log(data);
    });

    const loginId =
      localStorage.getItem('loginId') == null
        ? ''
        : localStorage.getItem('loginId');
    if (loginId != null) {
      this.loginService.getUserByUserName(loginId).subscribe((data) => {
        this.user = data;
      });
    }
  }
  likeTweet(tweetId: string) {
    const loginId =
      localStorage.getItem('loginId') == null
        ? ''
        : localStorage.getItem('loginId');
    if (loginId != null) {
      this.loginService.addLike(loginId, tweetId).subscribe();
      this.getLatestTweet();
    }
  }

  reply() {
    const loginId =
      localStorage.getItem('loginId') == null
        ? ''
        : localStorage.getItem('loginId');
    if (loginId != null) {
      this.loginService
        .addComment(loginId, this.tweetId, this.comment)
        .subscribe(
          (data) => {},
          (err) => {
            alert(err.message);
          }
        );
      this.getLatestTweet();
    }
  }

  search() {
    this.loginService.getUserByUserName(this.searchUser).subscribe((data) => {
      this.router.navigate(['/search', this.searchUser]);
    });
  }

  addTweet() {
    const loginId =
      localStorage.getItem('loginId') == null
        ? ''
        : localStorage.getItem('loginId');
    if (loginId != null) {
      const newTweet = {
        tweetText: this.tweetText,
      };
      this.loginService.createTweet(loginId, newTweet).subscribe();
    }
    this.getLatestTweet();
  }

  public onOpenModal(): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#addEmployeeModal');
    container?.appendChild(button);
    button.click();
  }

  public onOpenCommentModal(tempTweetId: string): void {
    this.tweetId = tempTweetId;
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#addCommentModal');
    container?.appendChild(button);
    button.click();
  }
}