// Directivas de angular
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// Bibliotecas para el uso de formularios
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

@NgModule({
    imports: [FormControl, FormGroup, FormsModule, ReactiveFormsModule, CommonModule],
    exports: [FormControl, FormGroup, FormsModule, ReactiveFormsModule, CommonModule],
})
export class FormulariosModule{}