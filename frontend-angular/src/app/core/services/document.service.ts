import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/documents/';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  uploadDocument(file: File, title: string, description: string, deptId: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('deptId', deptId.toString());

    let token = '';
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      token = user.token || '';
    }

    return this.http.post(API_URL + 'upload', formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  getMyDocuments(): Observable<any> {
    let token = '';
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      token = user.token || '';
    }

    return this.http.get(API_URL + 'my-documents', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  getPendingDocuments(): Observable<any> {
    let token = '';
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      token = user.token || '';
    }

    return this.http.get(API_URL + 'pending', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  approveDocument(documentId: string, action: string, comments: string): Observable<any> {
    let token = '';
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      token = user.token || '';
    }

    return this.http.post(`http://localhost:8080/api/approvals/${documentId}/process`, { action, comments }, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  resubmitDocument(documentId: string, file: File, title: string, description: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    let token = '';
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      token = user.token || '';
    }

    return this.http.put(`${API_URL}${documentId}/resubmit`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  getDocumentHistory(documentId: string): Observable<any> {
    let token = '';
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      token = user.token || '';
    }

    return this.http.get(`${API_URL}${documentId}/history`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }
}
