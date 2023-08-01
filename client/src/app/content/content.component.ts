

import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

declare var CKEDITOR: any;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements AfterViewInit {
  data = {
    userId: '',
    docId: '',
    title: '',
    createdBy: '',
    updatedBy: '',
    content: '',
  };

  @ViewChild('ckeditor', { static: true }) ckeditor!: ElementRef;

  constructor(private http: HttpClient, private router: Router, private route:ActivatedRoute) {
    const token = localStorage.getItem('jwtToken')
    if(!token){
      this.router.navigate(['/login'])
    }
  }

  ngAfterViewInit() {
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
        { name: 'about', items: ['About'] },
      ],
    });
  }

  saveContent() {
    const userId = localStorage.getItem('userId') || '';
    this.data.userId = userId;
    this.data.docId = this.route.snapshot.paramMap.get('id') || '';
    this.data.createdBy = localStorage.getItem('firstname') || '';
    this.data.updatedBy = localStorage.getItem('firstname') || '';

    console.log(this.data)

    // Get the CKEditor instance
    const editorInstance = CKEDITOR.instances[this.ckeditor.nativeElement.id];

    if (editorInstance && editorInstance.getData) {
      // Get the HTML content from CKEditor
      const htmlContent = editorInstance.getData();
      console.log(htmlContent)

      // Save the content to the backend
      this.http
        .post('http://localhost:5100/document', { ...this.data, content: htmlContent }, { responseType: 'text' })
        .subscribe(
          () => {
            window.alert('Content saved successfully');
            this.router.navigate(['/documents']);

          },
          (error) => {
            window.alert('Error saving content');
            console.error('Error saving content:', error);
          }
        );
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}


