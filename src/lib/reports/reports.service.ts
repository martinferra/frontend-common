import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, startWith, tap } from 'rxjs/operators';
import { TaskState } from '../models/interfaces/taskState.interface';
import { TaskType, AsyncTasksService } from './async-tasks.service';
import { FileDownloadService } from '../file-download/file-download.service';

@Injectable({ providedIn: 'root' })
export class ReportsService {

  constructor(
    private asyncTasksService: AsyncTasksService,
    private fileDownloadService: FileDownloadService
  ) { }

  public getReport(reportId: string, filenamePreffix: string = '', fileExt: string, ...reportParams: any[]) : Observable<TaskState> {

    let fileName = `${filenamePreffix || reportId}_${moment().format('YYYYMMDDHHmmss')}.${fileExt}`;

    const params = {
      reportId,
      reportParams,
      ...(fileExt.toLowerCase() === 'zip' ? { responseFormat: 'named' } : {})
    };
    return this.asyncTasksService.runTask(TaskType.rpc, {name: 'getReport', params}).pipe(
      concatMap( (fileData: any) => {
        if (fileData && fileData.format === 'named-report') {
          if (typeof fileData.filename !== 'string' || !/^[^\\\/]+\.zip$/i.test(fileData.filename) ||
              !(fileData.content instanceof ArrayBuffer)) {
            throw new Error('Invalid named report response');
          }
          fileName = fileData.filename;
          fileData = fileData.content;
        }
        return typeof fileData === 'string'?
          this.fileDownloadService.downloadFile(fileData) :
          of(fileData);
      }),
      tap((fileContent: any) => {
        let blobContent;
        if (fileContent instanceof Blob) {
          blobContent = fileContent;
        } else if (fileContent instanceof ArrayBuffer) {
          blobContent = new Blob([new Uint8Array(fileContent)]);
        } else {
          blobContent = new Blob([fileContent]);
        }
        saveAs(blobContent, fileName);
      }),
      map(()=>{ return {
        message: fileName,
        error: false
      }}),
      catchError((error)=>{
        console.error(error);
        return of({
          message:'Error en la descarga:  '+fileName,
          error: true
        });
      }),
      startWith({
        message:'Descargando:  '+fileName,
        error: false
      }),
    )
  }
}
