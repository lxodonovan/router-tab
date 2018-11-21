import {AfterContentInit, ContentChildren, Directive, OnDestroy, QueryList} from '@angular/core';
import {MatTabGroup} from '@angular/material';
import {Subscription} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {RouterTab} from './router-tab.directive';

@Directive({
  selector: '[routerTabs]'
})
export class RouterTabs implements AfterContentInit, OnDestroy {

  subscription = new Subscription();
  initialNavigationComplete = false;

  @ContentChildren(RouterTab) routerTabs: QueryList<RouterTab>;

  constructor(private host: MatTabGroup, private router: Router) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterContentInit(): void {
    this.setIndex();
    this.initialNavigationComplete = false;
    this.subscription.add(this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.setIndex();
        this.initialNavigationComplete = true;
      }
    }));
    this.subscription.add(this.host.selectedTabChange.subscribe(() => {
      const tab = this.routerTabs.find(item => item.tab.isActive);
      if (!tab || !this.initialNavigationComplete) {
        return;
      }
      this.router.navigateByUrl(tab.link.urlTree);
      return true;
    }));
  }


  private setIndex() {
    this.routerTabs.find((tab, i) => {
      if (!this.router.isActive(tab.link.urlTree, false))
        return false;
      tab.tab.isActive = true;
      this.host.selectedIndex = i;
      return true;
    });
  }


}
