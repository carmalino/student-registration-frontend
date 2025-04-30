import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Subject } from '../../models/subject.model';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private readonly api = `${environment.apiUrl}/subjects`;

  constructor(private http: HttpClient) {}

  /** Obtiene todas las materias con su profesor */
  getAll(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.api);
  }
}
