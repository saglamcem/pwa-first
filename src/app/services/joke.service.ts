import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Joke } from "../model/joke";

@Injectable({
  providedIn: 'root'
})
export class JokeService {
  constructor(private readonly http: HttpClient) { }

  getJoke(): Observable<Joke> {
    return this.http.get<Joke>('https://v2.jokeapi.dev/joke/Dark')
      .pipe();
  }
}
