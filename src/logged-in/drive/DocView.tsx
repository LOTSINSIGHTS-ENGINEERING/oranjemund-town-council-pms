import DocViewer, { DocViewerRenderers } from "react-doc-viewer";

import React, { FC } from 'react';

interface PdfViewerProps {
  documents: { uri: string }[];
}

const PdfViewer: FC<PdfViewerProps> = ({ documents }) => {
  return <DocViewer documents={documents} pluginRenderers={DocViewerRenderers} />;
};

export default PdfViewer