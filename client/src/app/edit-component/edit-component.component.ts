import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare var CKEDITOR: any;

@Component({
  selector: 'app-edit-component',
  templateUrl: './edit-component.component.html',
  styleUrls: ['./edit-component.component.css']
})
export class EditComponentComponent implements OnInit, AfterViewInit {
  savedTitle!: string;
  isLoading = false;

  data: any = {
    title: '',
    content: '',
  };

  docId: any = ''

  @ViewChild('ckeditor', { static: true }) ckeditor!: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      this.router.navigate(['/login'])
    }
    // Get the docId from the URL
    this.route.params.subscribe(params => {
      const docId = params['docId'];
      if (docId) {
        // Fetch the document details based on the docId
        this.loadContent(docId);
      }
    });
  }

  loadContent(docId: number) {
    this.data.updatedBy = localStorage.getItem('firstname')
    this.isLoading = true;  
    const url = `http://localhost:5100/document/${docId}`;
    this.docId = docId
    this.http.get(url).subscribe(
      (response: any) => {
        this.isLoading = false;  
        this.data.title = response.title;
        this.data.updatedBy = response.updatedBy;
        this.data.content = response.content;
        // Set the CKEditor content
        CKEDITOR.instances[this.ckeditor.nativeElement.id].setData(this.data.content);
      },
      (error) => {
        console.error('Error loading content:', error);
      }
    );
  }
  // ... rest of the component code remains unchanged ...



  saveContent(): void {
    const url = `http://localhost:5100/document/${this.docId}`; // Update URL with docId

    const requestBody = {
      ...this.data,
      content: this.data.content,
      editorName: localStorage.getItem('firstname') // Include the editorName in the requestBody
    };

    this.http.put(url, requestBody).subscribe(
      (res: any) => {
        if (res.status === 200) {
          window.alert('Content updated successfully');
          console.log('Content updated successfully');
          this.router.navigate(['/documents']);
        } else {
          window.alert('Error updating content');
          console.error('Error updating content:', res.statusText);
        }
      },(error) => {
        if (error.status === 200) {
          window.alert('Content updated successfully');
          console.log('Content updated successfully');
          this.router.navigate(['/documents']);
        } else {
          window.alert('Error updating content');
          console.error('Error updating content:', error.statusText);
        }
      }
    );
  }


  cancel(): void {
    this.router.navigate(['/documents']);
  }

  ngAfterViewInit(): void {
    this.loadCKEditor();
  }

  loadCKEditor(): void {
    CKEDITOR.replace(this.ckeditor.nativeElement, {
      toolbar: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', 'Blockquote'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'tools', items: ['Maximize'] },
        { name: 'document', items: ['Source'] },
        '/',
        { name: 'styles', items: ['Styles', 'Format'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
        { name: 'insert', items: ['Image', 'Table', 'HorizontalRule'] },
        { name: 'editing', items: ['Undo', 'Redo'] },
        { name: 'others', items: ['ShowBlocks'] },
        { name: 'about', items: ['About'] }
      ]
    });

    CKEDITOR.instances[this.ckeditor.nativeElement.id].setData(this.data.content);

    CKEDITOR.instances[this.ckeditor.nativeElement.id].on('change', () => {
      this.data.content = CKEDITOR.instances[this.ckeditor.nativeElement.id].getData();
    });
  }

  del() {
    this.http.delete(`http://localhost:3000/pages/${this.savedTitle}`).subscribe(
      () => {
        console.log('Page deleted successfully.');
        // Perform any additional actions after successful deletion
        this.router.navigate(['/pages']);
      },
      (error) => {
        console.error('Error deleting page:', error);
      }
    );
  }
}
