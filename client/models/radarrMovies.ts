export interface IRadarrQueue {
    records: RadarrQueueRecord[];
}

export interface RadarrQueueRecord {
    movieId:                 number;
    languages:               Language[];
    quality:                 RecordQuality;
    customFormats:           any[];
    size:                    number;
    title:                   string;
    sizeleft:                number;
    timeleft:                string;
    estimatedCompletionTime: Date;
    status:                  string;
    trackedDownloadStatus:   string;
    trackedDownloadState:    string;
    statusMessages:          any[];
    downloadId:              string;
    protocol:                string;
    downloadClient:          string;
    indexer:                 string;
    outputPath:              string;
    id:                      number;
}

export interface Language {
    id:   number;
    name: string;
}

export interface RecordQuality {
    quality:  QualityQuality;
    revision: Revision;
}

export interface QualityQuality {
    id:         number;
    name:       string;
    source:     string;
    resolution: number;
    modifier:   string;
}

export interface Revision {
    version:  number;
    real:     number;
    isRepack: boolean;
}
