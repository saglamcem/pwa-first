import { Component } from '@angular/core';
import { JokeService } from "./services/joke.service";
import { Observable } from "rxjs";
import { Joke } from "./model/joke";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pwa-first';

  joke$: Observable<Joke> = this.joker.getJoke();

  constructor(private readonly joker: JokeService) {}
}
