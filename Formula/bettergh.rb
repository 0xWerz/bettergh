class Bgh < Formula
  desc "An opinionated wrapper around gh CLI with better UX"
  homepage "https://github.com/0xWerz/bettergh"
  version "1.0.0"
  license "MIT"

  depends_on "gh"

  on_macos do
    on_arm do
      url "https://github.com/0xWerz/bettergh/releases/download/v1.0.0/bgh-darwin-arm64"
      sha256 "8c69b148273f7776c9f395a75dd3d3066e6d60b411578c0247a5e95dfa975459"
    end
    on_intel do
      url "https://github.com/0xWerz/bettergh/releases/download/v1.0.0/bgh-darwin-x64"
      sha256 "57fc52420937b65e2b971ce90d047a7c37df410fd79d0495c6e73cbff0509f32"
    end
  end

  on_linux do
    on_intel do
      url "https://github.com/0xWerz/bettergh/releases/download/v1.0.0/bgh-linux-x64"
      sha256 "f4e8ce59c7af97e7cb7d31d5ee5fc9a87b415d2c184659103e37315fef2e707b"
    end
  end

  def install
    binary_name = stable.url.split("/").last
    bin.install binary_name => "bgh"
  end

  test do
    assert_match "Better GitHub CLI", shell_output("#{bin}/bgh help")
  end
end
