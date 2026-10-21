import { HttpClient } from '@angular/common/http';
import { Service } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models/user-model';
import { inject } from '@angular/core';

@Service()
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.apiUrl, user);
  }

  updateUser(id: number, user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
