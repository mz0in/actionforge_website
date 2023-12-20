import { Component, Input } from '@angular/core';
import { IconType } from '@ng-icons/core';
import { octQuestion } from '@ng-icons/octicons';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrls: ['./app-button.component.css']
})
export class AppButtonComponent {
  @Input() color = "currentColor"
  @Input() iconName: IconType = octQuestion;
  @Input() disabled = false;
  @Input() hasPadding = true;
}
