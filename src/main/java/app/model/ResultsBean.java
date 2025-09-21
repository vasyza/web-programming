package app.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ResultsBean implements Serializable {
    private final List<Result> results = new ArrayList<>();

    public void add(Result r) { results.add(r); }

    public List<Result> getAll() { return Collections.unmodifiableList(results); }
}

