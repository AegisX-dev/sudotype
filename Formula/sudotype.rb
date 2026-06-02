class Sudotype < Formula
  desc "Retro hacker-themed terminal typing trainer"
  homepage "https://github.com/aegis-dev/sudotype"
  # To install via NPM registry tarball once published:
  url "https://registry.npmjs.org/sudotype/-/sudotype-1.0.1.tgz"
  sha256 "0000000000000000000000000000000000000000000000000000000000000000" # Update with actual SHA256 after publish
  license "ISC"

  depends_on "node"

  # Support installing directly from the GitHub repository HEAD
  head "https://github.com/aegis-dev/sudotype.git", branch: "main"

  def install
    if build.head?
      # Installing from GitHub HEAD
      system "npm", "install"
      system "npm", "run", "build"
      
      # Copy all files into libexec
      libexec.install Dir["*"]
      
      # Create symlink wrapper script in bin
      bin.mkpath
      (bin/"sudotype").write <<~EOS
        #!/bin/bash
        exec node "#{libexec}/dist/index.js" "$@"
      EOS
      chmod 0755, bin/"sudotype"
    else
      # Installing from NPM Registry tarball
      system "npm", "install", *std_npm_args(keep_only_modules: true)
      bin.install_symlink Dir["#{libexec}/bin/*"]
    end
  end

  test do
    assert_match "sudotype version", shell_output("#{bin}/sudotype --version")
  end
end
