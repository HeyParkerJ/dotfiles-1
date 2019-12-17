;;; config-rainbow-mode --- configure rainbow-mode support
;;; Commentary:
;; rainbow-mode highlights CSS color names and expressions (short, long, rgba,
;; etc) with the color indicated.

;;; Code:
(require 'use-package)

;; configure rainbow-mode
(defun config-rainbow-mode ()
  "Configure rainbow-mode."
  (use-package "rainbow-mode"
    ;; :init
    :config
    (setq-default rainbow-identifiers-faces-to-override
                  '(
                    js2-object-property-access
                    js2-function-call
                    js2-object-property
                    font-lock-function-name-face
                    font-lock-variable-name-face
                    highlight-numbers-number
                    font-lock-constant-face
                    font-lock-keyword-face
                    )
                  )
    (add-hook 'org-mode-hook 'rainbow-mode)
    (add-hook 'css-mode-hook 'rainbow-mode)
    (add-hook 'prog-mode-hook 'rainbow-mode)
    ))
(provide 'config-rainbow-mode)

;;; config-rainbow-mode.el ends here
