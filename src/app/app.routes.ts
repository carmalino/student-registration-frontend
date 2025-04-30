// src/app/app.routes.ts
import { Routes } from '@angular/router';

// <-- aquí la ruta correcta:
import { EnrollmentComponent } from './features/enrollment/enrollment/enrollment.component';
import { StudentListComponent } from './features/students/student-list/student-list.component';
import { StudentFormComponent } from './features/students/student-form/student-form.component';
import { ClassmatesComponent } from './features/classmates/classmates/classmates.component';

export const routes: Routes = [  
  { path: 'enroll', component: EnrollmentComponent },
  { path: 'classmates', component: ClassmatesComponent },
  { path: 'students/new', component: StudentFormComponent },
  { path: 'students/edit/:id', component: StudentFormComponent },  
  { path: 'students', component: StudentListComponent },
  { path: '', redirectTo: 'students', pathMatch: 'full' },
  { path: '**', redirectTo: 'students' },
];

