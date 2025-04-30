import { Component, OnInit } from '@angular/core';
import { CommonModule }        from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { StudentService }       from '../../../core/services/student.service';
import { Student }              from '../../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  studentId!: number;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private svc: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      program: ['', Validators.required]
    });
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.studentId = +idParam;
      this.loading = true;
      this.svc.getById(this.studentId).subscribe({
        next: (s: Student) => {
          this.form.patchValue({ name: s.name, program: s.program });
          this.loading = false;
        },
        error: () => {
          this.error = 'No se encontró el estudiante.';
          this.loading = false;
        }
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    const dto = { name: this.form.value.name, program: this.form.value.program };

    if (this.isEdit) {
      this.svc.update(this.studentId, { id: this.studentId, ...dto })
        .subscribe({
          next: () => this.router.navigate(['/students']),
          error: () => this.error = 'Error al actualizar.'
        });
    } else {
      this.svc.create(dto)
        .subscribe({
          next: () => this.router.navigate(['/students']),
          error: () => this.error = 'Error al crear.'
        });
    }
  }

  cancel() {
    this.router.navigate(['/students']);
  }
}
