// Permite mostrar mensajes más personalizados
import Swal from "sweetalert2";

export class SwalMessages{

    // Mensaje de éxito
    successMessage(message: string){
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            toast: true,
            text: message,
            background: '#E8F8F8',
            showConfirmButton: false,
            timer: 2000
        });
    }

    // Mensaje de error
    errorMessage(message: string){
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            toast: true,
            text: message,
            background: '#F8E8F8',
            showConfirmButton: false,
            timer: 2000
        });
    }

    // Mensaje para confirmación
    confirmMessage = Swal.mixin({
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `Cancelar`,
        confirmButtonText: `Confirmar`,
        customClass: {
            title: 'swal-title',
            icon: 'swal-icon',
            confirmButton: 'btn noneb btn-success swal-confirm-button',
            cancelButton: 'btn  noneb btn-danger swal-cancel-button',
        },
    });
}

// Ejemplo de cómo usar el mensaje de confirmación en un componente.
//
//     import { SwalMessages } from '../../../../shared/swal-messages';
//     swal: SwalMessages = new SwalMessages();
// 
//     this.swal.confirmMessage.fire({
//         title: "Favor de confirmar el borrado",
//       }).then((result) => {
//         if (result.isConfirmed) {
//           this.customerService.disableCustomer(id).subscribe({
//             next: (v) => {
//               this.swal.successMessage(v.message);
//               this.getCustomers();
//             },
//             error: (e) => {
//               console.error(e);
//               this.swal.errorMessage(e.error!.message);
//             }
//           });
//         }
//       });