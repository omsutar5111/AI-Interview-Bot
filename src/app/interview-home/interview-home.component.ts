import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormDataService } from './form-data.service';


@Component({
  selector: 'app-interview-home',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './interview-home.component.html',
  styleUrl: './interview-home.component.scss'
})
export class InterviewHomeComponent {
  form: FormGroup;
  @Output() formSubmitted = new EventEmitter<any>();
  resumeError: string | null = null;

  constructor(private fb: FormBuilder ,private router:Router,private formservice:FormDataService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      resume: [null, Validators.required],
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validFormats = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validFormats.includes(file.type)) {
        this.resumeError = 'Invalid file format. Only PDF, TXT, or Word documents are allowed.';
        this.form.get('resume')?.setErrors({ invalid: true });
      } else if (file.size > 5 * 1024 * 1024) {
        this.resumeError = 'File size exceeds the maximum limit of 5 MB.';
        this.form.get('resume')?.setErrors({ invalid: true });
      } else {
        this.resumeError = null;
        this.form.patchValue({ resume: file });
      }
    }
  }

  onSubmit(): void {
    if (this.form.valid && !this.resumeError) {
      console.log('Form submitted:', this.form.value);
      this.router.navigate(['/interview-bot']);
     this.formservice.setFormData(this.form.value)
     console.log(this.form.value.name);
    }
  }

}
