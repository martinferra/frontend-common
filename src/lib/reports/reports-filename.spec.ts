import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { FileDownloadService } from '../file-download/file-download.service';
import { TaskState } from '../models/interfaces/taskState.interface';
import { AsyncTasksService, TaskType } from './async-tasks.service';
import { ReportsService } from './reports.service';

describe('ReportsService ZIP filenames', () => {
  let tasks: jasmine.SpyObj<AsyncTasksService>;
  let downloads: jasmine.SpyObj<FileDownloadService>;
  let service: ReportsService;
  let savedName: string | undefined;

  beforeEach(() => {
    tasks = jasmine.createSpyObj<AsyncTasksService>('AsyncTasksService', ['runTask']);
    downloads = jasmine.createSpyObj<FileDownloadService>('FileDownloadService', ['downloadFile']);
    service = new ReportsService(tasks, downloads);
    spyOn(URL, 'createObjectURL').and.returnValue('blob:report');
    spyOn(URL, 'revokeObjectURL');
    spyOn(HTMLAnchorElement.prototype, 'dispatchEvent').and.callFake(function (this: HTMLAnchorElement) {
      savedName = this.download;
      return true;
    });
  });

  it('uses the server filename for named ZIP responses', fakeAsync(() => {
    const data = new Uint8Array([1, 2, 3]).buffer;
    tasks.runTask.and.returnValue(of({ format: 'named-report', filename: 'carpeta_123.zip', content: data }));
    const states: TaskState[] = [];

    service.getReport('test', 'fallback', 'zip', { monthId: '202610' }).subscribe(state => states.push(state));
    tick(0);

    expect(tasks.runTask).toHaveBeenCalledWith(TaskType.rpc, {
      name: 'getReport',
      params: { reportId: 'test', reportParams: [{ monthId: '202610' }], responseFormat: 'named' }
    });
    expect(savedName).toBe('carpeta_123.zip');
    expect(states[states.length - 1]).toEqual({ message: 'carpeta_123.zip', error: false });
    tick(40000);
  }));

  it('falls back to the existing name for legacy ZIP responses', fakeAsync(() => {
    tasks.runTask.and.returnValue(of(new Uint8Array([1, 2, 3]).buffer));
    const states: TaskState[] = [];

    service.getReport('test', 'fallback', 'zip').subscribe(state => states.push(state));
    tick(0);

    expect(savedName).toMatch(/^fallback_\d{14}\.zip$/);
    expect(states[states.length - 1].message).toBe(savedName!);
    tick(40000);
  }));

  it('continues downloading legacy single reports by their temporary filename', fakeAsync(() => {
    tasks.runTask.and.returnValue(of('temporary.xlsx'));
    downloads.downloadFile.and.returnValue(of(new Blob(['excel'])));

    service.getReport('test', 'fallback', 'xlsx').subscribe();
    tick(0);

    expect(tasks.runTask).toHaveBeenCalledWith(TaskType.rpc, {
      name: 'getReport', params: { reportId: 'test', reportParams: [] }
    });
    expect(downloads.downloadFile).toHaveBeenCalledWith('temporary.xlsx');
    expect(savedName).toMatch(/^fallback_\d{14}\.xlsx$/);
    tick(40000);
  }));

  it('reports an invalid named response instead of downloading it', () => {
    tasks.runTask.and.returnValue(of({ format: 'named-report', filename: '../bad.zip', content: new ArrayBuffer(0) }));
    spyOn(console, 'error');
    const states: TaskState[] = [];

    service.getReport('test', 'fallback', 'zip').subscribe(state => states.push(state));

    expect(states[states.length - 1].error).toBeTrue();
    expect(savedName).toBeUndefined();
  });
});
