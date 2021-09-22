import { Component} from '@angular/core';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'quickorder-technical-task';

  public records: any[] = [];
  public sheets: any[] = [];
  public workbook: any = [];

  uploadFile($event: any): void {

    const files = $event.srcElement.files;
    const input = $event.target;
    const reader = new FileReader();
    
    if (this.isCSVFile(files[0])){

      reader.readAsText(input.files[0]);
      reader.onload = () => {
        const data: string | ArrayBuffer | null = reader.result;
        this.records = this.csvFileToJSON(<string> data);
      };
    }

    if (this.isXLSXFile(files[0])) {

      reader.readAsBinaryString(files[0]);
      reader.onload = () => {
        const data = reader.result;
        const workbook = XLSX.read(data, {type: 'binary'});
        this.workbook = workbook;
        const sheet = workbook.SheetNames;
        this.sheets = sheet;
        this.getSheet(workbook.SheetNames[0])
      }
    }
  } 

  getSheet(sheetName:string) {
    const worksheet = this.workbook.Sheets[sheetName];
    this.records = XLSX.utils.sheet_to_json(worksheet,{raw:true});
  }

  getKeys(jsonObject:any) {
    return (jsonObject && jsonObject.length > 0) ? Object.keys(jsonObject[0]) : [];
  }

  csvFileToJSON(file:string){

    const lines = file.split("\n");
    const headers = <any>lines[0].split(",");

    return new Array(lines.map((l:string) => {
      const obj:Array<string> = [];
      const currentline = l.split(",");

      headers.map((e:string, i:number) => {
        obj[headers[i]] = currentline[i]; // did not have time to consider a more type friendly way of handling this case
      })
    }))
  }

  isCSVFile(file: File) {
    return file.name.endsWith(".csv");
  }

  isXLSXFile(file: File) {
    return file.name.endsWith(".xlsx");
  }

}
