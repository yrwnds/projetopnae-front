import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {RouterOutlet} from '@angular/router';
import {MatFormField} from '@angular/material/form-field';

@Component({
  selector: 'app-root-component',
  imports: [
    MatCard,
    MatCardTitle,
    MatFormField,
    MatCardSubtitle,
    MatCardHeader,
    MatCardContent,
    RouterOutlet
  ],
  templateUrl: './root-component.html',
  styleUrl: './root-component.css',
})
export class RootComponent {
}
