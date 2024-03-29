import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ThemeService} from "../../../services/theme.service";
import {Subscription} from "rxjs";
import {employeeDataStore} from "../../data-stores/employee-data-store";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NgClass, NgFor, NgIf} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  animal: string | undefined;
  name: string | undefined;

  userId: any;

  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  // test data for profile
  employeeDataStore = employeeDataStore
  employee: any

  coverImages: any[] = [
    'https://c1.wallpaperflare.com/preview/88/241/234/adult-blur-bokeh-city.jpg',
    'https://c1.wallpaperflare.com/preview/704/487/655/59687928ebb22-thumbnail.jpg',
    'https://e0.pxfuel.com/wallpapers/1017/992/desktop-wallpaper-rainy-night-background-for-your-mobile-tablet-explore-rainy-background-rainy-day-widescreen-rainy-day-dark-rainy-night.jpg',
    'https://e0.pxfuel.com/wallpapers/116/359/desktop-wallpaper-laptop-jason-choi-zy-23-rainy-london-thumbnail.jpg',
    'https://c4.wallpaperflare.com/wallpaper/564/101/189/autumn-forest-glade-wallpaper-preview.jpg',
    'https://wallpaper-house.com/data/out/12/wallpaper2you_513656.jpg',
    'https://c4.wallpaperflare.com/wallpaper/480/252/986/best-pictures-of-nature-hd-picture-1920x1080-wallpaper-preview.jpg',
    'https://wallpapercave.com/wp/wp8335968.jpg',
    'https://wallup.net/wp-content/uploads/2019/09/309505-forests-paths-golden-sunlight-morning-creek.jpg',
  ]

  constructor(
    private themeService: ThemeService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private logger: NGXLogger) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Logic to update active class based on the current route
        this.updateActiveClass();
      }
    });

    this.getUser();
  }

  getUser() {
    employeeDataStore.forEach((emp) => {
      this.route.paramMap.subscribe(params => {
        this.userId = params.get('id');

        if (emp.id == this.userId) {
          this.employee = [emp];
        }
      })
    })
  }

  openVideoDialog() {
    const dialogRef = this.dialog.open(PostVideoComponent, {
      data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  randomCoverImage() {
    return this.coverImages[Math.floor(Math.random() * this.coverImages.length)];
  }

  navigateBetweenTabs(path: string) {
    this.router.navigate([`/profile/${this.userId}/${path}/${this.userId}`]);
  }

  updateActiveClass() {
    const currentRoute = this.router.url;

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.nav-link[href="${currentRoute}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
  isActive(path: string) {
    return this.router.url === `/profile/${this.userId}/${path}/${this.userId}`;
  }
}

@Component({
  selector: 'app-post-video',
  templateUrl: '../post-video/post-video.component.html',
  styleUrls: ['../post-video/post-video.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgClass, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule, NgFor, NgIf],
})
export class PostVideoComponent {
  private themeSubscription: Subscription;
  isDarkMode: boolean | undefined;

  constructor(private themeService: ThemeService, public dialog: MatDialog) {
    this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
      this.isDarkMode = isDarkMode;
    });
  }
}
