// src/app/features/classmates/classmates/classmates.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StudentService }    from '../../../core/services/student.service';
import { EnrolledSubjectDto } from '../../../models/enrolled-subject.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classmates',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './classmates.component.html',
  styleUrls: ['./classmates.component.css']
})
export class ClassmatesComponent implements OnInit {
  studentId!: number;
  enrolled: EnrolledSubjectDto[] = [];
  loading = true;
  error = '';

  constructor(
    private studSvc: StudentService,
    private route: ActivatedRoute,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('studentId');
      if (id) {
        this.studentId = +id;
        this.loadClassmates();
      } else {
        this.error = 'Falta parámetro studentId en la URL';
        this.loading = false;
      }
    });
  }

  private loadClassmates(): void {
    this.studSvc.getEnrolled(this.studentId).subscribe({
      next: data => {
        this.enrolled = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar compañeros de clase';
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/students']);
  }
}
