// Cache for package versions to avoid repeated API calls
const versionCache = new Map<string, string>()

export interface PackageVersionOptions {
  type: 'npm' | 'vscode-extension'
  id: string
}

/**
 * Fetch the latest version of an npm package
 */
async function fetchNpmVersion(packageName: string): Promise<string> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`)
    if (!response.ok) {
      console.warn(`Failed to fetch npm package version for ${packageName}`)
      return ''
    }
    const data = await response.json()
    return data.version || ''
  }
  catch (error) {
    console.warn(`Error fetching npm version for ${packageName}:`, error)
    return ''
  }
}

/**
 * Fetch the latest version of a VS Code extension
 */
async function fetchVSCodeExtensionVersion(extensionId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json;api-version=3.0-preview.1',
        },
        body: JSON.stringify({
          filters: [
            {
              criteria: [
                { filterType: 7, value: extensionId },
              ],
            },
          ],
          flags: 914,
        }),
      },
    )

    if (!response.ok) {
      console.warn(`Failed to fetch VS Code extension version for ${extensionId}`)
      return ''
    }

    const data = await response.json()
    const extension = data.results?.[0]?.extensions?.[0]
    if (extension?.versions?.[0]?.version) {
      return extension.versions[0].version
    }
    return ''
  }
  catch (error) {
    console.warn(`Error fetching VS Code extension version for ${extensionId}:`, error)
    return ''
  }
}

/**
 * Fetch package version with caching
 */
export async function getPackageVersion(options: PackageVersionOptions): Promise<string> {
  const cacheKey = `${options.type}:${options.id}`

  // Check cache first
  if (versionCache.has(cacheKey)) {
    return versionCache.get(cacheKey)!
  }

  // Fetch version based on type
  let version = ''
  if (options.type === 'npm') {
    version = await fetchNpmVersion(options.id)
  }
  else if (options.type === 'vscode-extension') {
    version = await fetchVSCodeExtensionVersion(options.id)
  }

  // Cache the result
  if (version) {
    versionCache.set(cacheKey, version)
  }

  return version
}

/**
 * Prefetch and cache all package versions
 */
export async function prefetchVersions(packages: PackageVersionOptions[]): Promise<void> {
  await Promise.all(
    packages.map(pkg => getPackageVersion(pkg)),
  )
}
