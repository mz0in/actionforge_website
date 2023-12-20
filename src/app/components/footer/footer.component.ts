import { AfterViewInit, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { EmailService } from 'src/app/services/email.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements AfterViewInit {
    es = inject(EmailService);

    @ViewChild('emailLink') emailLink!: ElementRef<HTMLAnchorElement>;

    ngAfterViewInit(): void {
        this.es.e$.subscribe(e => {
            this.emailLink.nativeElement.href = `mailto:${e}`;
        });
    }
}
