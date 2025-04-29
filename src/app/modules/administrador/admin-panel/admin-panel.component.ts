import { Component } from '@angular/core';
import { User } from './_model/User.dto';
import { UsuarioServiceService } from './_service/usuario-service.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalMessages } from '../../../shared/swal-messages';

@Component({
  selector: 'app-admin-panel',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

  users: User[] = [];
  swal: SwalMessages = new SwalMessages(); // swal messages
  formUserToEdit: FormGroup = new FormGroup({});;
  mostrarFormulario = false;

  constructor(private usuarioService:UsuarioServiceService){}

  ngOnInit():void{
    this.mostrarFormulario = false;
    this.usuarioService.obtenerTodosLosUsuarios().subscribe(data => {
      this.users=data
    });

    this.formUserToEdit = new FormGroup({
      idUsuario: new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
      apellidoP: new FormControl('', [Validators.required]),
      apellidoM: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required]),
      password: new FormControl(''),
      token: new FormControl(''),
      esAdministrador: new FormControl('')
    });

  }

  selectUserToEdit(user: User): void{
    this.formUserToEdit.patchValue({
      idUsuario: user.idUsuario,
      nombre: user.nombre,
      apellidoP: user.apellidoP,
      apellidoM: user.apellidoM,
      mail: user.mail,
      password: user.password,
      token: user.token,
      esAdministrador: user.esAdministrador
    });

    this.mostrarFormulario = !this.mostrarFormulario;
  }


  updateUser(): void {
    if(this.formUserToEdit.valid){

      console.log(JSON.stringify(this.formUserToEdit.value));

      const user: User = {
        idUsuario: this.formUserToEdit.value.idUsuario,
        nombre: this.formUserToEdit.value.nombre,
        apellidoP: this.formUserToEdit.value.apellidoP,
        apellidoM: this.formUserToEdit.value.apellidoM,
        mail: this.formUserToEdit.value.mail,
        password: this.formUserToEdit.value.password,
        token: this.formUserToEdit.value.token,
        esAdministrador: this.formUserToEdit.value.esAdministrador
      };
      this.usuarioService.actualizarUSuario(user).subscribe(data => {
        this.formUserToEdit.reset();
        this.ngOnInit();
        this.swal.successMessage("Usuario actualizado correctamente");
      }, error => {
        console.error("Error al actualizar el usuario", error);
        this.swal.errorMessage("Error al actualizar el usuario");
      });

    }else{
      alert("Formulario inválido");
    }
  }

  deleteUser(user: User): void {
    this.usuarioService.eliminarUsuario(user).subscribe(data => {
      this.swal.successMessage(data);
      this.ngOnInit();
    }, error => {
      console.error("Error al eliminar el usuario", error);
      this.swal.errorMessage("Error al eliminar el usuario");
    });
  }

}
