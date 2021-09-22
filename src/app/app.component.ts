import { Component} from '@angular/core';
import * as XLSX from 'xlsx'; 



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'quickorder-technical-task';

  public records: any[] = []
  public sheets: any[] = [];
  public workbook: any = [];

  uploadFile($event: Event): void {

    const files = ($event.target as HTMLInputElement).files!;
    const reader = new FileReader();
    
    if (this.isCSVFile(files[0])){

      reader.readAsText(files[0]);
      reader.onload = () => {
        const data = reader.result as string;
        this.records = this.csvFileToJSON(data) as unknown as Object[];
      };
    }

    if (this.isXLSXFile(files[0])) {

      reader.readAsBinaryString(files[0]);
      reader.onload = () => {
        const data = reader.result;
        const workbook = XLSX.read(data, {type: 'binary'});
        this.workbook = workbook;
        this.sheets = workbook.SheetNames;
        this.getSheet(workbook.SheetNames[0])
      }
    }
  } 

  getSheet(sheetName:string) {
    const worksheet = this.workbook.Sheets[sheetName];
    this.records = XLSX.utils.sheet_to_json(worksheet,{raw:true});
  }

  getKeys(object:any) {
    return (object) ? Object.keys(object[0]) : [];
  }

  csvFileToJSON(data:string){
    const lines = data.split("\n");
    const headers = lines[0].split(",");

    let result = lines
    .filter((_:string, index:number)=> { return index > 0 })
    .map((line:string) => {
      const obj:any = [];
      var currentline=line.split(",");

      for(var j=0;j<headers.length;j++){
        obj[headers[j]] = currentline[j];
      }
      return obj;
    })

    return result;
  }

  isCSVFile(file: File) {
    return file.name.endsWith(".csv");
  }

  isXLSXFile(file: File) {
    return file.name.endsWith(".xlsx");
  }

}
