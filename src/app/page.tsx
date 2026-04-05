import { EndpointPlayground } from "@/components/endpoint-playground";
import { ScrollReveal } from "@/components/scroll-reveal";
import { MultiLangCode } from "@/components/multi-lang-code";
import { FloatingNav } from "@/components/floating-nav";

const baseUrl = "https://srm-pyq-api.onrender.com";
const sampleCourseCodeRaw = ",20PCSE85J";
const sampleCourseCode = "%2C20PCSE85J";
const samplePaperId = "5aebb8f3-2946-4442-81ce-af1a64efad42";
const sampleFileId = "603c3731-865a-43eb-96c1-d46da96f5814";

type Param = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

type CodeExamples = {
  python: string;
  curl: string;
  javascript: string;
  go: string;
  php: string;
  ruby: string;
};

type EndpointDoc = {
  id: string;
  method: "GET";
  path: string;
  summary: string;
  pathParams: Param[];
  queryParams: Param[];
  codeExamples: CodeExamples;
  responseShape: string;
  runPath: string;
  runQuery?: Record<string, string | number>;
};

const endpointDocs: EndpointDoc[] = [
  {
    id: "health",
    method: "GET",
    path: "/health",
    summary: "Health check endpoint for verifying the SRM PYQ API is running and responsive.",
    pathParams: [],
    queryParams: [],
    codeExamples: {
      python: `import requests

BASE_URL = "${baseUrl}"
response = requests.get(f"{BASE_URL}/health", timeout=15)
response.raise_for_status()
print(response.json())`,
      curl: `curl -X GET "${baseUrl}/health" \\
  -H "Accept: application/json"`,
      javascript: `const response = await fetch("${baseUrl}/health", {
  method: "GET",
  headers: { "Accept": "application/json" }
});

const data = await response.json();
console.log(data);`,
      go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    resp, err := http.Get("${baseUrl}/health")
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result)
}`,
      php: `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${baseUrl}/health");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Accept: application/json"]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);`,
      ruby: `require 'net/http'
require 'json'

uri = URI("${baseUrl}/health")
response = Net::HTTP.get_response(uri)
data = JSON.parse(response.body)
puts data`,
    },
    responseShape: `{
  "ok": true
}`,
    runPath: "/health",
  },
  {
    id: "list-courses",
    method: "GET",
    path: "/v1/courses",
    summary: "Browse and search the SRM course catalog with cursor-based pagination. Filter courses by code or name to find the right exam papers.",
    pathParams: [],
    queryParams: [
      {
        name: "q",
        type: "string",
        required: false,
        description: "Search against course_code and course_name.",
      },
      {
        name: "cursor",
        type: "string",
        required: false,
        description: "Last seen course_code for pagination.",
      },
      {
        name: "limit",
        type: "int (1-200)",
        required: false,
        description: "Page size, defaults to 50.",
      },
    ],
    codeExamples: {
      python: `import requests

BASE_URL = "${baseUrl}"
params = {"q": "spring", "limit": 5}
response = requests.get(f"{BASE_URL}/v1/courses", params=params, timeout=15)
response.raise_for_status()
payload = response.json()
print(payload["data"])
print(payload["page"])`,
      curl: `curl -X GET "${baseUrl}/v1/courses?q=spring&limit=5" \\
  -H "Accept: application/json"`,
      javascript: `const params = new URLSearchParams({ q: "spring", limit: "5" });
const response = await fetch(\`${baseUrl}/v1/courses?\${params}\`, {
  method: "GET",
  headers: { "Accept": "application/json" }
});

const { data, page } = await response.json();
console.log(data);
console.log(page);`,
      go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "net/url"
)

func main() {
    baseURL := "${baseUrl}/v1/courses"
    params := url.Values{}
    params.Add("q", "spring")
    params.Add("limit", "5")

    resp, err := http.Get(baseURL + "?" + params.Encode())
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result["data"])
    fmt.Println(result["page"])
}`,
      php: `<?php
$params = http_build_query(["q" => "spring", "limit" => 5]);
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${baseUrl}/v1/courses?" . $params);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Accept: application/json"]);

$response = curl_exec($ch);
curl_close($ch);

$payload = json_decode($response, true);
print_r($payload["data"]);
print_r($payload["page"]);`,
      ruby: `require 'net/http'
require 'json'
require 'uri'

uri = URI("${baseUrl}/v1/courses")
uri.query = URI.encode_www_form({ q: "spring", limit: 5 })

response = Net::HTTP.get_response(uri)
payload = JSON.parse(response.body)
puts payload["data"]
puts payload["page"]`,
    },
    responseShape: `{
  "data": [
    {
      "id": "uuid",
      "course_code": "string",
      "course_name": "string",
      "department": "string|null",
      "program": "string|null",
      "semester": "number|null",
      "is_active": true
    }
  ],
  "page": {
    "has_more": true,
    "next_cursor": "string|null",
    "limit": 50
  }
}`,
    runPath: "/v1/courses",
    runQuery: { limit: 3 },
  },
  {
    id: "get-course",
    method: "GET",
    path: "/v1/courses/{course_code}",
    summary: "Retrieve full details for a specific SRM course including department, program, and semester information.",
    pathParams: [
      {
        name: "course_code",
        type: "string",
        required: true,
        description: "Use URL-encoding for special characters.",
      },
    ],
    queryParams: [],
    codeExamples: {
      python: `from urllib.parse import quote
import requests

BASE_URL = "${baseUrl}"
course_code = "${sampleCourseCodeRaw}"
encoded = quote(course_code, safe="")
response = requests.get(f"{BASE_URL}/v1/courses/{encoded}", timeout=15)
response.raise_for_status()
print(response.json()["data"])`,
      curl: `# Note: course_code must be URL-encoded
curl -X GET "${baseUrl}/v1/courses/${sampleCourseCode}" \\
  -H "Accept: application/json"`,
      javascript: `const courseCode = "${sampleCourseCodeRaw}";
const encoded = encodeURIComponent(courseCode);
const response = await fetch(\`${baseUrl}/v1/courses/\${encoded}\`, {
  method: "GET",
  headers: { "Accept": "application/json" }
});

const { data } = await response.json();
console.log(data);`,
      go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "net/url"
)

func main() {
    courseCode := "${sampleCourseCodeRaw}"
    encoded := url.PathEscape(courseCode)
    apiURL := fmt.Sprintf("${baseUrl}/v1/courses/%s", encoded)

    resp, err := http.Get(apiURL)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result["data"])
}`,
      php: `<?php
$courseCode = "${sampleCourseCodeRaw}";
$encoded = rawurlencode($courseCode);
$url = "${baseUrl}/v1/courses/" . $encoded;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Accept: application/json"]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data["data"]);`,
      ruby: `require 'net/http'
require 'json'
require 'uri'

course_code = "${sampleCourseCodeRaw}"
encoded = URI.encode_www_form_component(course_code)
uri = URI("${baseUrl}/v1/courses/#{encoded}")

response = Net::HTTP.get_response(uri)
data = JSON.parse(response.body)
puts data["data"]`,
    },
    responseShape: `{
  "data": {
    "id": "uuid",
    "course_code": "string",
    "course_name": "string",
    "department": "string|null",
    "program": "string|null",
    "semester": "number|null",
    "is_active": true
  }
}`,
    runPath: `/v1/courses/${sampleCourseCode}`,
  },
  {
    id: "list-course-papers",
    method: "GET",
    path: "/v1/courses/{course_code}/papers",
    summary: "List all previous year question papers for a given SRM course. Filter by exam year or term to find specific papers.",
    pathParams: [
      {
        name: "course_code",
        type: "string",
        required: true,
        description: "Course code (URL-encode when needed).",
      },
    ],
    queryParams: [
      {
        name: "year",
        type: "int",
        required: false,
        description: "Filter by exam year.",
      },
      {
        name: "term",
        type: "string",
        required: false,
        description: "Filter by exam term like nov_dec.",
      },
      {
        name: "cursor",
        type: "string",
        required: false,
        description: "Last seen source_item_url for paging.",
      },
      {
        name: "limit",
        type: "int (1-200)",
        required: false,
        description: "Page size, defaults to 50.",
      },
    ],
    codeExamples: {
      python: `from urllib.parse import quote
import requests

BASE_URL = "${baseUrl}"
course_code = "${sampleCourseCodeRaw}"
encoded = quote(course_code, safe="")
params = {"term": "nov_dec", "limit": 5}
response = requests.get(
    f"{BASE_URL}/v1/courses/{encoded}/papers",
    params=params,
    timeout=15,
)
response.raise_for_status()
payload = response.json()
print(payload["course"])
print(payload["data"])
print(payload["page"])`,
      curl: `# Note: course_code must be URL-encoded
curl -X GET "${baseUrl}/v1/courses/${sampleCourseCode}/papers?term=nov_dec&limit=5" \\
  -H "Accept: application/json"`,
      javascript: `const courseCode = "${sampleCourseCodeRaw}";
const encoded = encodeURIComponent(courseCode);
const params = new URLSearchParams({ term: "nov_dec", limit: "5" });

const response = await fetch(
  \`${baseUrl}/v1/courses/\${encoded}/papers?\${params}\`,
  {
    method: "GET",
    headers: { "Accept": "application/json" }
  }
);

const { course, data, page } = await response.json();
console.log(course);
console.log(data);
console.log(page);`,
      go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "net/url"
)

func main() {
    courseCode := "${sampleCourseCodeRaw}"
    encoded := url.PathEscape(courseCode)
    
    params := url.Values{}
    params.Add("term", "nov_dec")
    params.Add("limit", "5")
    
    apiURL := fmt.Sprintf("${baseUrl}/v1/courses/%s/papers?%s", encoded, params.Encode())

    resp, err := http.Get(apiURL)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result["course"])
    fmt.Println(result["data"])
}`,
      php: `<?php
$courseCode = "${sampleCourseCodeRaw}";
$encoded = rawurlencode($courseCode);
$params = http_build_query(["term" => "nov_dec", "limit" => 5]);
$url = "${baseUrl}/v1/courses/" . $encoded . "/papers?" . $params;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Accept: application/json"]);

$response = curl_exec($ch);
curl_close($ch);

$payload = json_decode($response, true);
print_r($payload["course"]);
print_r($payload["data"]);
print_r($payload["page"]);`,
      ruby: `require 'net/http'
require 'json'
require 'uri'

course_code = "${sampleCourseCodeRaw}"
encoded = URI.encode_www_form_component(course_code)
uri = URI("${baseUrl}/v1/courses/#{encoded}/papers")
uri.query = URI.encode_www_form({ term: "nov_dec", limit: 5 })

response = Net::HTTP.get_response(uri)
payload = JSON.parse(response.body)
puts payload["course"]
puts payload["data"]
puts payload["page"]`,
    },
    responseShape: `{
  "data": ["Paper", "..."],
  "course": {
    "id": "uuid",
    "course_code": "string",
    "course_name": "string"
  },
  "page": {
    "has_more": true,
    "next_cursor": "string|null",
    "limit": 50
  }
}`,
    runPath: `/v1/courses/${sampleCourseCode}/papers`,
    runQuery: { limit: 3 },
  },
  {
    id: "get-paper",
    method: "GET",
    path: "/v1/papers/{paper_id}",
    summary: "Get detailed metadata for a specific SRM question paper including exam year, term, and source information.",
    pathParams: [
      {
        name: "paper_id",
        type: "uuid",
        required: true,
        description: "Unique identifier of a paper.",
      },
    ],
    queryParams: [],
    codeExamples: {
      python: `import requests

BASE_URL = "${baseUrl}"
paper_id = "${samplePaperId}"
response = requests.get(f"{BASE_URL}/v1/papers/{paper_id}", timeout=15)
response.raise_for_status()
print(response.json()["data"])`,
      curl: `curl -X GET "${baseUrl}/v1/papers/${samplePaperId}" \\
  -H "Accept: application/json"`,
      javascript: `const paperId = "${samplePaperId}";
const response = await fetch(\`${baseUrl}/v1/papers/\${paperId}\`, {
  method: "GET",
  headers: { "Accept": "application/json" }
});

const { data } = await response.json();
console.log(data);`,
      go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    paperId := "${samplePaperId}"
    apiURL := fmt.Sprintf("${baseUrl}/v1/papers/%s", paperId)

    resp, err := http.Get(apiURL)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result["data"])
}`,
      php: `<?php
$paperId = "${samplePaperId}";
$url = "${baseUrl}/v1/papers/" . $paperId;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Accept: application/json"]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data["data"]);`,
      ruby: `require 'net/http'
require 'json'

paper_id = "${samplePaperId}"
uri = URI("${baseUrl}/v1/papers/#{paper_id}")

response = Net::HTTP.get_response(uri)
data = JSON.parse(response.body)
puts data["data"]`,
    },
    responseShape: `{
  "data": {
    "id": "uuid",
    "course_id": "uuid",
    "title": "string",
    "exam_year": "number|null",
    "exam_month": "number|null",
    "exam_term": "string|null",
    "session_label": "string|null",
    "source_subject_url": "string|null",
    "source_item_url": "string",
    "publisher": "string|null",
    "metadata": {
      "exam_month": "number|null",
      "exam_year": "number|null",
      "semester": ["number", "..."] ,
      "page_found": "number|null"
    },
    "created_at": "iso-datetime",
    "course": {
      "id": "uuid",
      "course_code": "string",
      "course_name": "string"
    }
  }
}`,
    runPath: `/v1/papers/${samplePaperId}`,
  },
  {
    id: "list-paper-files",
    method: "GET",
    path: "/v1/papers/{paper_id}/files",
    summary: "List all PDF files attached to a question paper, including storage details and public download URLs.",
    pathParams: [
      {
        name: "paper_id",
        type: "uuid",
        required: true,
        description: "Unique identifier of a paper.",
      },
    ],
    queryParams: [],
    codeExamples: {
      python: `import requests

BASE_URL = "${baseUrl}"
paper_id = "${samplePaperId}"
response = requests.get(f"{BASE_URL}/v1/papers/{paper_id}/files", timeout=15)
response.raise_for_status()
files = response.json()["data"]
print(files)`,
      curl: `curl -X GET "${baseUrl}/v1/papers/${samplePaperId}/files" \\
  -H "Accept: application/json"`,
      javascript: `const paperId = "${samplePaperId}";
const response = await fetch(\`${baseUrl}/v1/papers/\${paperId}/files\`, {
  method: "GET",
  headers: { "Accept": "application/json" }
});

const { data: files } = await response.json();
console.log(files);`,
      go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    paperId := "${samplePaperId}"
    apiURL := fmt.Sprintf("${baseUrl}/v1/papers/%s/files", paperId)

    resp, err := http.Get(apiURL)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result["data"])
}`,
      php: `<?php
$paperId = "${samplePaperId}";
$url = "${baseUrl}/v1/papers/" . $paperId . "/files";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Accept: application/json"]);

$response = curl_exec($ch);
curl_close($ch);

$files = json_decode($response, true)["data"];
print_r($files);`,
      ruby: `require 'net/http'
require 'json'

paper_id = "${samplePaperId}"
uri = URI("${baseUrl}/v1/papers/#{paper_id}/files")

response = Net::HTTP.get_response(uri)
files = JSON.parse(response.body)["data"]
puts files`,
    },
    responseShape: `{
  "data": [
    {
      "id": "uuid",
      "paper_id": "uuid",
      "storage_provider": "r2",
      "bucket": "string",
      "object_key": "string",
      "source_pdf_url": "string|null",
      "public_url": "string|null",
      "mime_type": "application/pdf",
      "size_bytes": "number|null",
      "sha256": "string|null",
      "is_primary": true,
      "created_at": "iso-datetime"
    }
  ]
}`,
    runPath: `/v1/papers/${samplePaperId}/files`,
  },
  {
    id: "get-download-url",
    method: "GET",
    path: "/v1/files/{file_id}/download",
    summary: "Generate a time-limited signed URL or retrieve a public link to download SRM question paper PDFs.",
    pathParams: [
      {
        name: "file_id",
        type: "uuid",
        required: true,
        description: "Unique identifier of the file record.",
      },
    ],
    queryParams: [
      {
        name: "ttl_seconds",
        type: "int (60-3600)",
        required: false,
        description: "Signed URL TTL, defaults to 900 seconds.",
      },
    ],
    codeExamples: {
      python: `import requests

BASE_URL = "${baseUrl}"
file_id = "${sampleFileId}"
response = requests.get(
    f"{BASE_URL}/v1/files/{file_id}/download",
    params={"ttl_seconds": 900},
    timeout=15,
)
response.raise_for_status()
print(response.json()["data"])`,
      curl: `curl -X GET "${baseUrl}/v1/files/${sampleFileId}/download?ttl_seconds=900" \\
  -H "Accept: application/json"`,
      javascript: `const fileId = "${sampleFileId}";
const params = new URLSearchParams({ ttl_seconds: "900" });

const response = await fetch(
  \`${baseUrl}/v1/files/\${fileId}/download?\${params}\`,
  {
    method: "GET",
    headers: { "Accept": "application/json" }
  }
);

const { data } = await response.json();
console.log(data);
// Use data.download_url to fetch the PDF`,
      go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "net/url"
)

func main() {
    fileId := "${sampleFileId}"
    params := url.Values{}
    params.Add("ttl_seconds", "900")
    
    apiURL := fmt.Sprintf("${baseUrl}/v1/files/%s/download?%s", fileId, params.Encode())

    resp, err := http.Get(apiURL)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Println(result["data"])
    // Use result["data"].(map[string]interface{})["download_url"] to fetch PDF
}`,
      php: `<?php
$fileId = "${sampleFileId}";
$params = http_build_query(["ttl_seconds" => 900]);
$url = "${baseUrl}/v1/files/" . $fileId . "/download?" . $params;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Accept: application/json"]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true)["data"];
print_r($data);
// Use $data["download_url"] to fetch the PDF`,
      ruby: `require 'net/http'
require 'json'
require 'uri'

file_id = "${sampleFileId}"
uri = URI("${baseUrl}/v1/files/#{file_id}/download")
uri.query = URI.encode_www_form({ ttl_seconds: 900 })

response = Net::HTTP.get_response(uri)
data = JSON.parse(response.body)["data"]
puts data
# Use data["download_url"] to fetch the PDF`,
    },
    responseShape: `{
  "data": {
    "file_id": "uuid",
    "download_url": "https://...",
    "url_type": "signed|public",
    "expires_in": "number|null"
  }
}`,
    runPath: `/v1/files/${sampleFileId}/download`,
    runQuery: { ttl_seconds: 900 },
  },
];

const navItems = [
  { id: "overview", label: "Overview" },
  { id: "models", label: "Data Models" },
  { id: "endpoints", label: "Endpoints" },
  { id: "patterns", label: "Integration Patterns" },
  { id: "errors", label: "Errors & Retries" },
];

function ParamTable({ title, params }: { title: string; params: Param[] }) {
  if (params.length === 0) {
    return (
      <div className="bezel-outer">
        <div className="bezel-inner p-5">
          <h4 className="text-sm font-medium tracking-tight text-foreground">{title}</h4>
          <p className="mt-3 text-sm text-text-muted">None</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bezel-outer">
      <div className="bezel-inner overflow-hidden">
        <h4 className="border-b border-border px-5 py-4 text-sm font-medium tracking-tight text-foreground">
          {title}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Required</th>
                <th className="px-5 py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map((param) => (
                <tr key={param.name} className="border-b border-border/50 last:border-b-0">
                  <td className="px-5 py-4 font-mono text-xs text-accent">{param.name}</td>
                  <td className="px-5 py-4 text-text-secondary">{param.type}</td>
                  <td className="px-5 py-4">
                    {param.required ? (
                      <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        yes
                      </span>
                    ) : (
                      <span className="text-text-muted">no</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-text-muted">{param.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="space-y-3">
      {label && <p className="text-xs font-medium uppercase tracking-[0.1em] text-text-muted">{label}</p>}
      <div className="code-block overflow-hidden">
        <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed text-text-secondary">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="hidden lg:block lg:sticky lg:top-32 lg:h-fit lg:w-[260px] lg:shrink-0">
      <div className="bezel-outer">
        <div className="bezel-inner overflow-hidden p-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Navigation</p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block truncate rounded-xl px-3 py-2.5 text-sm text-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/5 hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="my-5 h-px bg-border" />
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">Endpoints</p>
          <ul className="space-y-1">
            {endpointDocs.map((endpoint) => (
              <li key={endpoint.id}>
                <a
                  href={`#${endpoint.id}`}
                  className="group flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/5"
                >
                  <span className="shrink-0 font-mono text-[10px] text-accent">{endpoint.method}</span>
                  <span className="truncate font-mono text-xs text-text-muted transition-colors group-hover:text-foreground">
                    {endpoint.path}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default function Home() {
  return (
    <div className="min-h-[100dvh]">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />

      <FloatingNav activePage="docs" />

      <main className="relative mx-auto max-w-[1600px] px-4 pb-32 pt-32 md:px-8 lg:px-12">
        <div className="flex gap-12">
          <Sidebar />

          <article className="min-w-0 flex-1 space-y-32">
            {/* Hero Section */}
            <section id="overview" className="space-y-10 py-24">
              <ScrollReveal>
                <div className="eyebrow">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  API Documentation
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <h1 className="max-w-4xl text-5xl font-medium tracking-[-0.04em] text-foreground md:text-7xl lg:text-8xl">
                  SRM PYQ API
                </h1>
                <p className="mt-4 text-lg font-normal tracking-tight text-text-muted md:text-xl md:mt-6">
                  Access Previous Year Question Papers
                </p>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <p className="max-w-2xl text-lg leading-relaxed text-text-muted md:text-xl">
                  A comprehensive read-only REST API for accessing SRM university previous year question papers 
                  and exam materials. No authentication required. Built for developers creating study apps, 
                  exam preparation tools, and educational platforms that need programmatic access to 
                  SRM course papers and question paper data.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#endpoints"
                    className="btn-premium group bg-accent text-background hover:bg-accent/90"
                  >
                    <span className="font-medium">Explore Endpoints</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
                      <svg aria-label="Explore endpoints" role="img" className="h-4 w-4 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </span>
                  </a>
                  <a
                    href="/VIBE_CODING_REFERENCE.md"
                    download="VIBE_CODING_REFERENCE.md"
                    className="btn-premium group border border-border bg-transparent text-foreground hover:border-accent/50 hover:bg-accent/5"
                  >
                    <span>Download Reference</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-0.5 group-hover:scale-105 group-hover:bg-accent/20">
                        <svg aria-label="Download reference file" role="img" className="h-4 w-4 transition-colors group-hover:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </span>
                  </a>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <div className="bezel-outer max-w-2xl">
                  <div className="bezel-inner p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">Quick Start with Vibe Coding Reference</p>
                        <p className="text-sm leading-relaxed text-text-muted">
                          Download the <span className="text-accent">VIBE_CODING_REFERENCE.md</span> file and drop it into your project. 
                          It contains everything you need — endpoint specs, response schemas, and integration patterns — ready for 
                          AI-assisted coding tools or manual implementation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="bezel-outer max-w-xl">
                  <div className="bezel-inner flex items-center gap-4 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10">
                        <svg aria-label="Base URL" role="img" className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.1em] text-text-muted">Base URL</p>
                      <p className="mt-1 font-mono text-sm text-foreground">{baseUrl}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </section>

            {/* Data Models Section */}
            <section id="models" className="space-y-12">
              <ScrollReveal>
                <div className="space-y-4">
                  <div className="eyebrow">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Schema
                  </div>
                  <h2 className="text-4xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
                    Data Models
                  </h2>
                  <p className="max-w-2xl text-base leading-relaxed text-text-muted">
                    Core entities returned by the SRM PYQ API. Each response follows a consistent JSON schema 
                    wrapped in a <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-accent">data</code> key, making it straightforward to integrate SRM exam paper data into 
                    your applications.
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ScrollReveal delay={50}>
                  <div className="bezel-outer h-full">
                    <div className="bezel-inner h-full p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                          <svg aria-label="Course model" role="img" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Course — SRM Course Catalog Entry</h3>
                      </div>
                      <CodeBlock
                        code={`{
  "id": "uuid",
  "course_code": "string",
  "course_name": "string",
  "department": "string|null",
  "program": "string|null",
  "semester": "number|null",
  "is_active": true
}`}
                      />
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <div className="bezel-outer h-full">
                    <div className="bezel-inner h-full p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                          <svg aria-label="Paper model" role="img" className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Paper — Exam Question Paper Record</h3>
                      </div>
                      <CodeBlock
                        code={`{
  "id": "uuid",
  "course_id": "uuid",
  "title": "string",
  "exam_year": "number|null",
  "exam_month": "number|null",
  "exam_term": "string|null",
  "session_label": "string|null",
  "source_subject_url": "string|null",
  "source_item_url": "string",
  "publisher": "string|null",
  "created_at": "iso-datetime"
}`}
                      />
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={150}>
                  <div className="bezel-outer h-full">
                    <div className="bezel-inner h-full p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                          <svg aria-label="File model" role="img" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground">File — Question Paper PDF Metadata</h3>
                      </div>
                      <CodeBlock
                        code={`{
  "id": "uuid",
  "paper_id": "uuid",
  "storage_provider": "r2",
  "bucket": "string",
  "object_key": "string",
  "source_pdf_url": "string|null",
  "public_url": "string|null",
  "mime_type": "application/pdf",
  "size_bytes": "number|null",
  "sha256": "string|null",
  "is_primary": true,
  "created_at": "iso-datetime"
}`}
                      />
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                  <div className="bezel-outer h-full">
                    <div className="bezel-inner h-full p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10">
                          <svg aria-label="Download reference" role="img" className="h-4 w-4 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Download Response — Signed PDF Access URL</h3>
                      </div>
                      <CodeBlock
                        code={`{
  "data": {
    "file_id": "uuid",
    "download_url": "https://...",
    "url_type": "signed|public",
    "expires_in": 900
  }
}`}
                      />
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* Endpoints Section */}
            <section id="endpoints" className="space-y-12">
              <ScrollReveal>
                <div className="space-y-4">
                  <div className="eyebrow">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Reference
                  </div>
                  <h2 className="text-4xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
                    API Endpoints
                  </h2>
                  <p className="max-w-2xl text-base leading-relaxed text-text-muted">
                    Complete reference for every SRM PYQ API endpoint with live request testing. Each endpoint 
                    includes runnable code examples in Python, cURL, JavaScript, Go, PHP, and Ruby — plus an 
                    interactive playground to test queries against the production API in real time.
                  </p>
                </div>
              </ScrollReveal>

              <div className="space-y-10">
                {endpointDocs.map((endpoint, index) => (
                  <ScrollReveal key={endpoint.id} delay={index * 50}>
                    <section
                      id={endpoint.id}
                      className="bezel-outer"
                    >
                      <div className="bezel-inner space-y-8 p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center rounded-lg bg-accent/10 px-3 py-1.5 font-mono text-xs font-semibold text-accent">
                                {endpoint.method}
                              </span>
                              <code className="font-mono text-lg text-foreground">{endpoint.path}</code>
                            </div>
                            <p className="max-w-xl text-base text-text-muted">{endpoint.summary}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                          <ParamTable title="Path Parameters" params={endpoint.pathParams} />
                          <ParamTable title="Query Parameters" params={endpoint.queryParams} />
                        </div>

                        <MultiLangCode codes={endpoint.codeExamples} />
                        <CodeBlock label="Response Schema" code={endpoint.responseShape} />

                        <EndpointPlayground baseUrl={baseUrl} path={endpoint.runPath} query={endpoint.runQuery} />
                      </div>
                    </section>
                  </ScrollReveal>
                ))}
              </div>
            </section>

            {/* Integration Patterns Section */}
            <section id="patterns" className="space-y-12">
              <ScrollReveal>
                <div className="space-y-4">
                  <div className="eyebrow">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Guides
                  </div>
                  <h2 className="text-4xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
                    SRM API Integration Patterns
                  </h2>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <ScrollReveal delay={50}>
                  <div className="bezel-outer h-full">
                    <div className="bezel-inner flex h-full flex-col p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                        <span className="text-xl font-semibold text-accent">A</span>
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-foreground">Search &amp; Drill Down</h3>
                      <p className="text-sm leading-relaxed text-text-muted">
                        Search the SRM course catalog with <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-xs text-accent">/v1/courses?q=</code>, 
                        select a course_code, fetch its previous year question papers, retrieve file metadata, 
                        and download the PDF. Ideal for building study apps and exam preparation tools.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <div className="bezel-outer h-full">
                    <div className="bezel-inner flex h-full flex-col p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
                        <span className="text-xl font-semibold text-violet-400">B</span>
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-foreground">Cursor Pagination</h3>
                      <p className="text-sm leading-relaxed text-text-muted">
                        Efficiently paginate through large SRM course and paper listings using <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-xs text-accent">page.next_cursor</code> while 
                        <code className="ml-1 rounded bg-white/5 px-1 py-0.5 font-mono text-xs text-accent">has_more</code> is true. This pattern ensures your app can handle the full SRM question paper catalog without missing results.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={150}>
                  <div className="bezel-outer h-full">
                    <div className="bezel-inner flex h-full flex-col p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                        <span className="text-xl font-semibold text-amber-400">C</span>
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-foreground">Fresh Downloads</h3>
                      <p className="text-sm leading-relaxed text-text-muted">
                        Always request a fresh <code className="rounded bg-white/5 px-1 py-0.5 font-mono text-xs text-accent">/download</code> URL 
                        right before fetching SRM question paper PDFs. Signed URLs expire after a set duration, so generate them on-demand for reliable paper downloads.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* Errors Section */}
            <section id="errors" className="space-y-12">
              <ScrollReveal>
                <div className="space-y-4">
                  <div className="eyebrow">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Handling
                  </div>
                  <h2 className="text-4xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
                    Error Handling &amp; Retry Strategies
                  </h2>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <ScrollReveal delay={50}>
                  <div className="bezel-outer">
                    <div className="bezel-inner p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                        <svg aria-label="Retry recommended" role="img" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Retry Recommended</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-text-muted">
                        <strong className="text-foreground">500</strong> server errors and network timeouts. 
                        Use exponential backoff with jitter. Start at 1s, max 30s.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <div className="bezel-outer">
                    <div className="bezel-inner p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                          <svg aria-label="Fix request first" role="img" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Fix Request First</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-text-muted">
                        <strong className="text-foreground">404</strong> not found and <strong className="text-foreground">422</strong> validation errors. 
                        Check your request parameters before retrying.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          </article>
        </div>
      </main>
    </div>
  );
}
