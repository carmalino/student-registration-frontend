import { Component, OnInit }   from '@angular/core';
import { CommonModule }         from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StudentService }       from '../../../core/services/student.service';
import { Student }              from '../../../models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  loading = true;
  error = '';

  constructor(
    private studentSvc: StudentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.studentSvc.getAll()
      .subscribe({
        next: data => {
          this.students = data;
          this.loading = false;
        },
        error: err => {
          this.error = 'Error al cargar estudiantes';
          this.loading = false;
        }
      });
  }

  edit(id: number) {
    this.router.navigate(['/students', 'edit', id]);
  }

  delete(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este estudiante?')) return;
    this.studentSvc.delete(id).subscribe({
      next: () => this.students = this.students.filter(s => s.id !== id),
      error: () => alert('Error al eliminar')
    });
  }

  enroll(id: number) {
    this.router.navigate(['/enroll'], { queryParams: { studentId: id } });
  }
}
