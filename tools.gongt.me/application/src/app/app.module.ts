import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { getServerPassConfig } from '../utils/pageloaderConfig';
import { AppComponent } from './app.component';
import { IconComponent } from './components/icon/icon.component';
import { LeftBarComponent } from './mainframe/left-bar/left-bar.component';
import { TopBarComponent } from './mainframe/top-bar/top-bar.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { RoutingModule } from './routing/routing.module';

@NgModule({
	declarations: [AppComponent, TopBarComponent, LeftBarComponent, WelcomeComponent, IconComponent],
	imports: [
		RoutingModule,
		BrowserModule,
		BrowserAnimationsModule,
		MatIconModule,
		MatToolbarModule,
		MatButtonModule,
		MatSidenavModule,
		MatListModule,
		MatExpansionModule,
		MatProgressSpinnerModule,
		HttpClientModule,
		MatGridListModule,
		MatCardModule,
		MatMenuModule,
		LayoutModule,
	],
	providers: [],
	bootstrap: [AppComponent],
	exports: [LeftBarComponent, TopBarComponent, WelcomeComponent],
})
export class AppModule {
	constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
		const url = getServerPassConfig('staticUrl', '/_static') + '/images/mdi.svg';
		matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl(url));
	}
}
