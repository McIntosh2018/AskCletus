import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, mergeMap, switchMap } from 'rxjs';
import { User } from 'src/app/models/GithubUser';
import { IngredientsResponse } from 'src/app/models/IngredientsResponse';
import { AuthService } from 'src/app/Services/auth.service';
import { UserBarServiceService } from '../../Services/user-bar-service.service';

@Component({
  selector: 'app-bar-home',
  templateUrl: './bar-home.component.html',
  styleUrls: ['./bar-home.component.css']
})
export class BarHomeComponent implements OnInit {


  constructor(
    private _userBarService: UserBarServiceService,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _router: Router) { }

  bars: IngredientsResponse[] = []

  userBar$ = this._authService.user$.pipe(
    filter(x => x !== null),
    map(x => x!.userId),
    mergeMap(x => this._userBarService.getUserBar(x))
  );

  removeIngredient(id: number) {
    const userBars$ = this._userBarService.deleteIngredient(id).pipe(
      switchMap(() => this._userBarService.getUserBars())
    );
    userBars$.subscribe(ingredient => {
      this.bars = ingredient
    });
  }
  onGithubLogin() {
    this._authService.redirectGitHubToken();
  }

  ngOnInit(): void {
  }
}
