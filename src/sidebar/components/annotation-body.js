import { createElement } from 'preact';
import { useState } from 'preact/hooks';
import propTypes from 'prop-types';

import { isHidden } from '../util/annotation-metadata';

import Button from './button';
import Excerpt from './excerpt';
import MarkdownEditor from './markdown-editor';
import MarkdownView from './markdown-view';
import TagEditor from './tag-editor';
import TagList from './tag-list';

/**
 * Display the rendered content of an annotation.
 */
export default function AnnotationBody({
  annotation,
  isEditing,
  onEditTags,
  onEditText,
  tags,
  text,
}) {
  // Should the text content of `Excerpt` be rendered in a collapsed state,
  // assuming it is collapsible (exceeds allotted collapsed space)?
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Does the text content of `Excerpt` take up enough vertical space that
  // collapsing/expanding is relevant?
  const [isCollapsible, setIsCollapsible] = useState(false);

  const toggleText = isCollapsed ? 'More' : 'Less';
  const toggleTitle = isCollapsed
    ? 'Show full annotation text'
    : 'Show the first few lines only';

  const showExcerpt = !isEditing && text.length > 0;
  const showTagList = !isEditing && tags.length > 0;

  return (
    <section className="annotation-body">
      {showExcerpt && (
        <Excerpt
          collapse={isCollapsed}
          collapsedHeight={400}
          inlineControls={false}
          onCollapsibleChanged={setIsCollapsible}
          onToggleCollapsed={setIsCollapsed}
          overflowThreshold={20}
        >
          <MarkdownView
            markdown={text}
            textClass={{
              'annotation-body__text': true,
              'is-hidden': isHidden(annotation),
              'has-content': text.length > 0,
            }}
          />
        </Excerpt>
      )}
      {isEditing && (
        <MarkdownEditor
          label="Annotation body"
          text={text}
          onEditText={onEditText}
        />
      )}
      {isCollapsible && !isEditing && (
        <div className="annotation-body__collapse-toggle">
          <Button
            className="annotation-body__collapse-toggle-button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            buttonText={toggleText}
            title={toggleTitle}
          />
        </div>
      )}
      {showTagList && <TagList annotation={annotation} tags={tags} />}
      {isEditing && <TagEditor onEditTags={onEditTags} tagList={tags} />}
    </section>
  );
}

AnnotationBody.propTypes = {
  /**
   * The annotation in question
   */
  annotation: propTypes.object.isRequired,

  /**
   * Whether to display the body in edit mode (if true) or view mode.
   */
  isEditing: propTypes.bool,

  /**
   * Callback invoked when the user edits tags.
   */
  onEditTags: propTypes.func,

  /**
   * Callback invoked when the user edits the content of the annotation body.
   */
  onEditText: propTypes.func,

  tags: propTypes.array.isRequired,

  /**
   * The markdown annotation body, which is either rendered as HTML (if `isEditing`
   * is false) or displayed in a text area otherwise.
   */
  text: propTypes.string,
};
