//
//  AVAsset+assetByTrimming.swift
//
//
// Credits to: https://gist.github.com/jakebromberg/098c328d87bd25ec0ae693b877cb933c#file-avassettrim-swift
//

import Foundation
import AVFoundation

struct TrimError: Error {
    let description: String
    let underlyingError: Error?

    init(_ description: String, underlyingError: Error? = nil) {
        self.description = "TrimVideo: " + description
        self.underlyingError = underlyingError
    }
}

extension AVAsset {
    func assetByTrimming(timeOffStart: Double) throws -> AVAsset {
        return try assetByTrimming(timeStart: 0, timeEnd: timeOffStart)
    }
    
    func assetByTrimming(timeStart: Double, timeEnd: Double) throws -> AVAsset {
        let timeRange = CMTimeRange(
            start: CMTime(seconds: timeStart, preferredTimescale: CMTimeScale(NSEC_PER_SEC)),
            end: CMTime(seconds: timeEnd, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
        )
        
        let composition = AVMutableComposition()
        
        do {
            for track in tracks {
                let compositionTrack = composition.addMutableTrack(withMediaType: track.mediaType, preferredTrackID: track.trackID)
                try compositionTrack?.insertTimeRange(timeRange, of: track, at: CMTime.zero)
            }
        } catch let error {
            throw TrimError("error during composition", underlyingError: error)
        }
        
        return composition
    }
}
