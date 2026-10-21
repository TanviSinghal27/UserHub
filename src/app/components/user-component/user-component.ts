import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user-service';
import { UserModel } from '../../models/user-model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-user-component',
  styleUrl: './user-component.css',
  templateUrl: './user-component.html',
})
export class UserComponent {
  private userService = inject(UserService);
  users = signal<UserModel[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isEditing = signal<boolean>(false);
  selectedUserId = signal<number | null>(null);
  userForm = signal<Partial<UserModel>>({ name: '', email: '' });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('⚠️Failed to load users.Please try again later.');
        setTimeout(() => this.errorMessage.set(null), 3000);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (!this.userForm().name || !this.userForm().email) return;
    this.isLoading.set(true);
    if (this.isEditing() && this.selectedUserId() !== null) {
      this.userService.updateUser(this.selectedUserId()!, this.userForm() as UserModel).subscribe({
        next: (updatedUser) => {
          this.users.update((list) =>
            list.map((u) => (u.id === this.selectedUserId() ? { ...u, ...updatedUser } : u)),
          );
        },
        error: (err) => {
          this.errorMessage.set(`Unable to update user data.`);
          setTimeout(() => this.errorMessage.set(null), 3000);
          this.isLoading.set(false);
        },
        complete: () => this.isLoading.set(false),
      });
    } else {
      this.userService.addUser(this.userForm() as UserModel).subscribe({
        next: (newUser) => {
          this.users.update((list) => [...list, { ...newUser, id: list.length + 1 }]);
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage.set(`⚠️Unable to create new user.`);
          setTimeout(() => this.errorMessage.set(null), 3000);
          this.isLoading.set(false);
        },
        complete: () => this.isLoading.set(false),
      });
    }
  }

  editUser(user: UserModel): void {
    if (!user.id || user.id < 1 || user.id > 10) {
      this.errorMessage.set('⚠️You have not authorization to edit this user data.');
      setTimeout(() => this.errorMessage.set(null), 3000);
      return;
    }
    this.isEditing.set(true);
    this.selectedUserId.set(user.id || null);
    this.userForm.set({ name: user.name, email: user.email });
  }

  deleteUser(id: number | undefined): void {
    if (!id) return;
    const confirmDelete = confirm('Are you sure you want to delete the user?');
    if (!confirmDelete) return;
    this.isLoading.set(true);
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((user) => user.id !== id));
      },
      error: (err) => {
        this.errorMessage.set(`⚠️Unable to delete user.`);
        setTimeout(() => this.errorMessage.set(null), 3000);
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false),
    });
  }
  resetForm(): void {
    this.isEditing.set(false);
    this.selectedUserId.set(null);
    this.userForm.set({ name: '', email: '' });
  }
}
