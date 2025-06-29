import { Fragment, useCallback, useMemo, useState } from "react";

import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { Hint } from "@/components/ui/hint";
import { Button } from "@/components/ui/button";
import { CodeView } from "@/components/code-view";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "@/components/ui/tree-view";

type FileCollection = { [path: string]: string };

const getLanguageFromExtension = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
};

interface FileBreadcrumbProps {
  filePath: string;
}

const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
  const pathSegments = filePath.split("/");
  const maxSegments = 3;

  const renderBreadcrumbItem = () => {
    if (pathSegments.length <= maxSegments) {
      return pathSegments.map((segment, idx) => {
        const isLast = idx === pathSegments.length - 1;
        return (
          <Fragment key={idx}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">
                  {segment}
                </BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = pathSegments[0];
      const lastSegment = pathSegments[pathSegments.length - 1];
      return (
        <>
          <BreadcrumbItem>
            <span>{firstSegment}</span>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {lastSegment}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbItem>
        </>
      );
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbItem()}</BreadcrumbList>
    </Breadcrumb>
  );
};

interface FileExplorerProps {
  files: FileCollection;
}

export function FileExplorer({ files }: FileExplorerProps) {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });
  const treeData = useMemo(() => convertFilesToTreeItems(files), [files]);
  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files]
  );

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50} className="bg-sidebar">
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              <FileBreadcrumb filePath={selectedFile} />
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? (
                    <CopyCheckIcon className="size-4" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView
                code={files[selectedFile]}
                language={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view its contents
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
