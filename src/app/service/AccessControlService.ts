import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TestsessionService } from "./TestsessionService";

@Injectable({
  providedIn: 'root'
})
export class AccessControlService implements CanActivate {

  constructor(private router: Router, private testsessionService: TestsessionService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const testsessionId = route.params['testsessionId'];

    return this.testsessionService.getTestsessionById(testsessionId).pipe(
      map(testsession => {
        const now = new Date();
        const startDate = new Date(testsession.startDate);
        const endDate = new Date(testsession.endDate);

        if (now >= startDate && now <= endDate) {
          return true;
        } else {
          this.router.navigate(['access-denied']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Error fetching testsession:', error);
        this.router.navigate(['error']);
        return of(false);
      })
    );
  }
}

