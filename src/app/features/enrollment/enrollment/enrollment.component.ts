import { Component, OnInit } from '@angular/core';
import { CommonModule }        from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { SubjectService }      from '../../../core/services/subject.service';
import { StudentService }      from '../../../core/services/student.service';
import { Subject }             from '../../../models/subject.model';
import { ActivatedRoute, Router }      from '@angular/router';

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {
  subjects: Subject[] = [];
  form: FormGroup;
  studentId!: number;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private subjSvc: SubjectService,
    private studSvc: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      selectedIds: this.fb.array<number>([], [
        Validators.required,
        Validators.maxLength(3),
        this.uniqueProfessorValidator.bind(this)
      ])
    });
  }

  ngOnInit() {
    // 1) Capturamos studentId de los query params
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('studentId');
      if (!id) {
        alert('Falta parámetro studentId en la URL');
        this.router.navigate(['/students']);
        return;
      }
      this.studentId = +id;

      // 2) Cargamos materias primero
      this.subjSvc.getAll().subscribe({
        next: subs => {
          this.subjects = subs;

          // 3) Luego precargamos las inscripciones
          this.studSvc.getEnrolled(this.studentId).subscribe({
            next: enrolled => {
              enrolled.forEach(e => this.toggleSelection(e.subjectId));
              // 4) Ya terminamos de cargar
              this.isLoading = false;
            },
            error: () => {
              alert('Error al cargar inscripciones previas');
              this.isLoading = false;
            }
          });
        },
        error: () => {
          alert('Error al cargar materias');
          this.isLoading = false;
        }
      });
    });
  }

  get selectedIds(): FormArray {
    return this.form.get('selectedIds') as FormArray;
  }

  toggleSelection(id: number) {
    const idx = this.selectedIds.value.indexOf(id);
    if (idx >= 0) {
      this.selectedIds.removeAt(idx);
    } else {
      this.selectedIds.push(this.fb.control(id));
    }
    this.form.updateValueAndValidity();
  }

  uniqueProfessorValidator(control: AbstractControl): ValidationErrors | null {
    const formArray = control as FormArray;
    const profs = (formArray.value as number[])
      .map(id => this.subjects.find(s => s.id === id)!.professorId);
    return new Set(profs).size === profs.length
      ? null
      : { repeatedProfessor: true };
  }

  submit() {
    if (this.form.invalid || !this.studentId) return;

    this.studSvc.enroll({
      studentId: this.studentId,
      subjectIds: this.selectedIds.value
    }).subscribe({
      next: msg => alert(msg),
      error: err => alert(err.error || 'Error al inscribir materias')
    });
  }

  cancel() {
    this.router.navigate(['/students']);
  }
}
