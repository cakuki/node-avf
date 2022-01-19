import AVFoundation
import Foundation

func run(args: [String]) throws {
    let sourceURL = URL(fileURLWithPath: args[1])
    let destinationURL = URL(fileURLWithPath: args[2])

    switch args.first {
    case "trim":
        let trimStart = Double(args[3])
        let trimEnd = Double(args[4])

        try trim(sourceURL: sourceURL, destinationURL: destinationURL, trimStart: trimStart!, trimEnd: trimEnd!)
    case "snapshot":
        let seconds = Double(args[3])
        try captureSnapShot(sourceURL: sourceURL, destinationURL: destinationURL, milliSeconds: seconds!)
    case "gif":
        print("In Gif case")
        try createGIF(sourceURL: sourceURL, destinationURL: destinationURL)
    case "help":
        showUsage(exitCode: 0)
    default:
        showUsage(exitCode: 1)
    }
}

func trim(sourceURL: URL, destinationURL: URL, trimStart: Double, trimEnd: Double) throws {
    let asset = AVURLAsset(url: sourceURL)
    let trimmedAsset = try asset.assetByTrimming(timeStart: trimStart, timeEnd: trimEnd)
    try trimmedAsset.export(to: destinationURL)
}

func captureSnapShot(sourceURL: URL, destinationURL: URL, milliSeconds: Double) throws {
    let asset = AVURLAsset(url: sourceURL)
    let img = try asset.captureVideoSnapshot(milliSeconds: milliSeconds)
    if #available(macOS 11, *) {
        try img.save(destination: destinationURL)
    } else {
        print("OS not supported: ", img)
    }
}

func createGIF(sourceURL: URL, destinationURL: URL) throws {
    let asset = AVURLAsset(url: sourceURL)
    print("Creating GIF")
    if #available(macOS 11, *) {
        let tempURL = try asset.createGIF()
        try moveFile(sourceURL: tempURL, destination: destinationURL)
        print("URL of gif: ", destinationURL)
    } else {
        print("OS not supported")
    }
}

func moveFile(sourceURL: URL, destination: URL) throws {
        try FileManager.default.removeFileIfNecessary(at: destination)
        try FileManager.default.moveItem(atPath: sourceURL.path, toPath: destination.path)
}

func showUsage(exitCode: Int32 = 0) {
    print(
        """
        Usage:
            avf <command> <input> <output> [args...]

            Commands:
                trim
                    avf trim <input> <output> <trimStart> <trimEnd>
                        trimStart: Double in seconds
                        trimEnd: Double in seconds

                    example:
                    avf trim ./input.mp4 ./output.mp4 5.321 7.921
        """
    )
    exit(exitCode)
}

do {
    try run(args: Array(CommandLine.arguments.dropFirst()))
} catch let error {
    print("avf failed: \(error)")
    exit(1)
}
