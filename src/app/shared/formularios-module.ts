import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
//libraries to use forms
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
    exports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class FormulariosModule{}