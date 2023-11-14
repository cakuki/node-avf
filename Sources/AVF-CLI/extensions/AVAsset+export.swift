// Taken mostly from https://gist.github.com/jakebromberg/098c328d87bd25ec0ae693b877cb933c#file-avassettrim-swift

import AVFoundation
import Foundation

struct ExportError: Error {
    let description: String
    let underlyingError: Error?

    init(_ description: String, underlyingError: Error? = nil) {
        self.description = "ExportError: " + description
        self.underlyingError = underlyingError
    }
}

extension AVAsset {
    func export(to destination: URL) throws {
        guard let exportSession = AVAssetExportSession(asset: self, presetName: AVAssetExportPresetPassthrough) else {
            throw ExportError("Could not create an export session")
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
            throw ExportError("error during export", underlyingError: error)
        }
    }
}
