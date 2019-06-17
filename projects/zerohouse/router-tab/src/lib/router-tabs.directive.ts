import { AfterContentInit, ContentChildren, Directive, OnDestroy, QueryList, OnInit } from '@angular/core';
import { MatTabGroup } from '@angular/material';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { RouterTab } from './router-tab.directive';

@Directive({
  selector: '[routerTabs]'
})
export class RouterTabs implements OnDestroy, AfterContentInit {

  private initialNav = true;
  private subscription = new Subscription();

  @ContentChildren(RouterTab) routerTabs: QueryList<RouterTab>;

  constructor(private host: MatTabGroup, private router: Router) {

  }

  ngAfterContentInit(): void {

    this.subscription.add(this.router.events.subscribe((e) => {
      if (this.initialNav && e instanceof NavigationEnd) {
        this.initialNav = false;
        this.setIndex();

        this.subscription.add(this.host.selectedIndexChange.subscribe(indx => {
          const activeTab = this.routerTabs.find(x => x.tab.isActive);
          if (activeTab) {
            if (!this.router.isActive(activeTab.link.urlTree, false)) {
              this.router.navigateByUrl(activeTab.link.urlTree);
            }
          }

        }));

      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
