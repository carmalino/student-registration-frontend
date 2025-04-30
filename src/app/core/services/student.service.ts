import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Student } from '../../models/student.model';
import { EnrolledSubjectDto } from '../../models/enrolled-subject.dto';
import { EnrollSubjectsRequest } from '../../models/enroll-subjects-request.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly api = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  /** Obtiene todos los estudiantes */
  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.api);
  }

  /** Obtiene un estudiante por ID */
  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.api}/${id}`);
  }

  /** Crea un estudiante nuevo */
  create(dto: { name: string; program: string }): Observable<number> {
    return this.http.post<number>(this.api, dto);
  }

  /** Actualiza un estudiante existente */
  update(id: number, dto: { id: number; name: string; program: string }): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, dto);
  }

  /** Elimina un estudiante */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  /** Obtiene las materias en las que está inscrito */
  getEnrolled(id: number): Observable<EnrolledSubjectDto[]> {
    return this.http.get<EnrolledSubjectDto[]>(`${this.api}/${id}/subjects`);
  }

  /** Inscribe materias a un estudiante y devuelve un string */
  enroll(request: EnrollSubjectsRequest): Observable<string> {
    // responseType:'text' le dice a HttpClient que no haga JSON.parse
    return this.http.post(
      `${this.api}/${request.studentId}/enroll-subjects`,
      request,
      { responseType: 'text' }
    );
  }
}
