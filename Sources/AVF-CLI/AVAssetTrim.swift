// Taken mostly from https://gist.github.com/jakebromberg/098c328d87bd25ec0ae693b877cb933c#file-avassettrim-swift

import AVFoundation
import Foundation

struct TrimError: Error {
    let description: String
    let underlyingError: Error?

    init(_ description: String, underlyingError: Error? = nil) {
        self.description = "TrimVideo: " + description
        self.underlyingError = underlyingError
    }
}

extension FileManager {
    func removeFileIfNecessary(at url: URL) throws {
        guard fileExists(atPath: url.path) else {
            return
        }

        do {
            try removeItem(at: url)
        } catch let error {
            throw TrimError("Couldn't remove existing destination file: \(error)")
        }
    }
}

@available(macOS 11, *)
extension CGImage {
    func save(destination: URL) throws {
        guard let cgDestination = CGImageDestinationCreateWithURL(destination as CFURL, UTType.png.identifier as CFString, 1, nil) else { throw TrimError("Could not create destination.") }
        CGImageDestinationAddImage(cgDestination, self, nil)
        let saved = CGImageDestinationFinalize(cgDestination)
        if !saved {
            throw TrimError("Could not save image.")
        } else {
            print("Image saved")
        }
    }
}

extension AVAsset {
    /// This function will generate image from a video at provided seconds.
    /// - Parameters:
    ///   - seconds: Seconds where image should be generated in Integer formate.
    ///   - onSuccess: This callback will be called when image is generated successfully.
    /// - Returns: Nothing
    func captureVideoSnapshot(milliSeconds: Double) throws -> CGImage {
        let imageGenerator = AVAssetImageGenerator(asset: self)
        imageGenerator.requestedTimeToleranceAfter = CMTime.zero
        imageGenerator.requestedTimeToleranceBefore = CMTime.zero
        imageGenerator.appliesPreferredTrackTransform = true
        let time = NSValue(time: CMTimeMake(value: Int64(milliSeconds), timescale: 1000))
        var finalImage: CGImage?
        var finalError: Error?
        let group = DispatchGroup()
        group.enter()
        DispatchQueue.global(qos: .background).async {
            imageGenerator.generateCGImagesAsynchronously(forTimes: [time]) { _, image, _, _, error in
                if let err = error {
                    finalError = err
                    group.leave()
                    print("Error in generating image: ", err.localizedDescription)
                    return
                }
                if let img = image {
                    finalImage = img
                    group.leave()
                }
            }
        }
        group.wait()
        if let err = finalError {
            throw err
        } else {
            return finalImage!
        }
    }

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

    func export(to destination: URL) throws {
        guard let exportSession = AVAssetExportSession(asset: self, presetName: AVAssetExportPresetPassthrough) else {
            throw TrimError("Could not create an export session")
        }

        exportSession.outputURL = destination
        exportSession.outputFileType = AVFileType.m4v
        exportSession.shouldOptimizeForNetworkUse = true

        let group = DispatchGroup()

        group.enter()

        try FileManager.default.removeFileIfNecessary(at: destination)

        exportSession.exportAsynchronously {
            group.leave()
        }

        group.wait()

        if let error = exportSession.error {
            throw TrimError("error during export", underlyingError: error)
        }
    }
}
