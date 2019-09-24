import XCTest
@testable import AVF_CLI

final class AVF_CLITests: XCTestCase {
    func testExample() {
        // This is an example of a functional test case.
        // Use XCTAssert and related functions to verify your tests produce the correct
        // results.
        XCTAssertEqual(AVF_CLI().text, "Hello, World!")
    }

    static var allTests = [
        ("testExample", testExample),
    ]
}
