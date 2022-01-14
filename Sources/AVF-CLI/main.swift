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
        try captureSnapShot(sourceURL: sourceURL, destinationURL: destinationURL, seconds: seconds!)
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

func captureSnapShot(sourceURL: URL, destinationURL: URL, seconds: Double) throws {
    let asset = AVURLAsset(url: sourceURL)
    let img = try asset.getCGImage(seconds: seconds)
    if #available(macOS 11, *) {
        try img.save(destination: destinationURL)
    } else {
        print("OS not supported: ", img)
    }
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
