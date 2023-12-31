import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Fix the import statement here

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent {
  documents: any[] = [];
  isLoading = false;
  searchQuery: string = '';
  userId = localStorage.getItem('userId')

  truncateContent(content: string, maxLength: number): string {
    if (content.length > maxLength) {
      return content.slice(0, maxLength) + '...';
    } else {
      return content;
    }
  }

  filteredDocuments: any[] = [];

  constructor(private http: HttpClient, private router: Router) { // Fix the import statement here
    this.isLoading = true
    this.http.get<any[]>('http://localhost:5100/documents').subscribe((res) => {
      this.documents = res;
      this.filteredDocuments = res;
      this.isLoading = false
    });
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      this.router.navigate(['/login'])
    }
  }

  

  // Existing method to apply the search filter
  applySearchFilter() {
    if (this.searchQuery === '') {
      // If the search query is empty, show all documents
      this.filteredDocuments = this.documents;
    } else {
      // If the search query is not empty, filter the documents based on the title
      this.filteredDocuments = this.documents.filter(document => document.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  }

  editDocument(docId: number) {
    // Find the document with the given docId
    const documentToEdit = this.documents.find(doc => doc.id === docId);
    console.log(docId)
    // Navigate to the text editor route with the document data as state
    this.router.navigate(['/editor', docId], { state: { document: documentToEdit } });
  }

  deleteDocument(docId: number) {
    // Implement your delete functionality here, e.g., show confirmation modal
    const response = confirm('Are you sure!')
    if (response) {
      this.http.delete(`http://localhost:5100/document/${docId}`).subscribe((res) => {
        if (res) {
          this.isLoading = true;
          this.http.get<any[]>('http://localhost:5100/documents').subscribe((res) => {
            this.documents = res;
            this.isLoading = true;
          });
          alert("Deleted Successfully!")
        }
      })
    }
  }
}
