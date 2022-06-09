import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  filter,
  fromEvent,
  map,
  mergeMap,
  Observable,
  startWith,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { DrinkResponse } from 'src/app/models/DrinkResponse';
import { HistoryResponse, PostHistory } from 'src/app/models/HistoryResponse';
import { AuthService } from 'src/app/Services/auth.service';
import { DrinkServiceService } from 'src/app/Services/drink-service.service';
import { HistoryService } from 'src/app/Services/history.service';

@Component({
  selector: 'app-drink-history',
  templateUrl: './drink-history.component.html',
  styleUrls: ['./drink-history.component.css'],
})
export class DrinkHistoryComponent implements OnInit, AfterViewInit, OnDestroy {
  histories: HistoryResponse[] = [];

  constructor(
    private _historyrService: HistoryService,
    private _authService: AuthService,
    private _drinkService: DrinkServiceService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    this.userBarId$ = this._authService.user$.pipe(
      filter((x) => x !== null),
      map((x) => x!.userId)
    );
  }

  postHistorySubscription!: Subscription;
  click$!: Observable<Event>;
  addHistoryClick$!: Observable<any>;
  postBar$!: Observable<PostHistory>;
  userBarId$: Observable<any>;

  userHistory$ = this._authService.user$.pipe(
    filter((x) => x !== null),
    map((x) => x!.userId),
    mergeMap((x) => this._historyrService.getHistory(x))
  );

  drinkHistory$ = this._activatedRoute.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id) => id !== null),
    map((id) => parseInt(id as string, 10)),
    switchMap((id: number) => this._historyrService.postHistory(id))
  );

  @ViewChild('button')
  addHistoryButton!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    this.click$ = fromEvent<Event>(this.addHistoryButton.nativeElement,'click');

    this.postBar$ = this.click$.pipe(
      startWith(() => {}),
      mergeMap((_clickEvent) => this.userBarId$),
      //tap(console.log),
      ),
      mergeMap((userId) =>
      this.drinkHistory$.pipe(map((drinkId) => ({ userId, drinkId })))
    ),
      mergeMap((drinkAndId: { drink: string; userId: number }) =>
        this._historyrService.postHistory(drinkAndId)
      )
    );
    this.postHistorySubscription = this.postBar$.subscribe(() =>
      this._router.navigate(['app-bar-home'])
    );
  }

  ngOnInit(): void {
    this._historyrService.getHistories().subscribe((history) => {
      this.histories = history;
    });
  }

  ngOnDestroy(): void {
    this.postHistorySubscription.unsubscribe();
  }
}
